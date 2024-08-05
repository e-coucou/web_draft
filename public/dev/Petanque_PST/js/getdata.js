let start = 0x0F, startOnce=true;
let eq=['A','B','C','D','E','F','G','H'];
let eqEC=[], tEC=[], pEC=[], idEqSel=0;

function launch(code) {
    start = start & code;
    // console.log(start);
    if (start === 0) {
        reInit();
    }
}
function getDataM(data) {
    m_json = data.val();
    launch(0x0E);
}
function getDataE(data) {
    e_json = data.val();
    launch(0x0D);
}
function getDataJ(data) {
    // console.log(data.val())
    j_json = data.val();
    launch(0x0B);
}

function getDataT(data) {
    // console.log(data.val())
    t_json = data.val();
    launch(0x07);
}

function errData(err) {
    console.log(err);
}

function reInit() {
    matchs = [], initJoueurs = [], equipes = [], joueurs = [], eJoueurs=[], annees=[];
    j_json.forEach(j => { initJoueurs.push( new Joueur(j.nom,j.id));});
    e_json.forEach(e => { equipes.push( new Equipe(e.nom,initJoueurs[e.J1],initJoueurs[e.J2],e.annee));});
    nbMatchs = Object.keys(m_json).length ;
    calculELO(true);
    if ( startOnce) {
        update_color(0);
        createButtons();
        setDateSel(annees.length-2); // on selectionne 2023
        startOnce = false;
    }
    redimButtons();
    mouseSelection = true;
}



function updateSelJoueur(id_) {
    let updates={};
    let j = j_json[id_];
    if (j.eC === undefined) {
        j.eC = 1;
    } else {
        j.eC = (j.eC + 1) % 3;
    }
    updates['/'+id_] = j;
    dbJoueurs.update(updates);

    // console.log(id_, j_json[id_]);
}
function resetSel() {
    let updates = {};
    j_json.forEach(e => {
        let joueur = initJoueurs.filter(j=>{ return j.id==e.id;})[0];
        e.eCSel = 0;
        updates['/'+int(e.id)] = e;
    });
    dbJoueurs.update(updates);
}
function GetJoueur(id_) {
    console.log("id "+id_,eqEC);
    let updates={};
    let j;
    if (id_%2===0) {
        j = pEC[int(id_/2)];
    } else {
        j = tEC[int(id_/2)];
    }
    console.log(j)
    let idJ = j.id;
    let c = eqEC.length;
    switch (c) {
        case 2: eqEC=[];
        case 0: 
            eqEC.push(idJ);
            // j.eq = 'A';
            // updates['/'+idJ] = j;
            // dbJoueurs.update(updates);
            break;
        case 1: if (j_json[idJ].eC === j_json[eqEC[0]].eC)
            {   return;
            } else {
                eqEC.push(idJ);
        let eq={j1:0,j2:0};
        eq.j1 = j_json[eqEC[0]];
        eq.j2 = j_json[eqEC[1]];
        eqs.push(eq);
                // j.eq = 'A';
                // updates['/'+idJ] = j;
                // dbJoueurs.update(updates);
            }
            break;
    }
    j.eCSel = (j.eCSel===undefined || j.eCSel===0)?1:0;
    updates['/'+idJ] = j;
    dbJoueurs.update(updates);

    console.log(idJ, j_json[idJ]);
}
function setRank() {
    let updates = {};
    j_json.forEach(e => {
        let joueur = initJoueurs.filter(j=>{ return j.id==e.id;})[0];
        e.rk = joueur.rank;
        updates['/'+int(e.id)] = e;
    });
    dbJoueurs.update(updates);
}
function updateTeam() {
    let id_ = (enCours-2020)*8;
    let updates = {};
    let eId = 0;
    eqs.forEach(a => {
        e = e_json[int(id_+eId)];
        e.J1=a.j1.id;
        e.J2=a.j2.id;
        e.annee = enCours;
        e.nom = eq[eId];
        updates['/'+int(eId+id_)] = e;
        eId += 1;
    });
    dbTeam.update(updates);
}
function resetTeamSel() {
    resetSel();
    resetTeam();
}

function resetTeam() {
    eqs = [];
    let id_ = (enCours-2020)*8;
    let updates = {};
    for (let eId=0;eId<8;eId++) {
        e = e_json[int(id_+eId)];
        e.J1=0;
        e.J2=0;
        e.annee = enCours;
        e.nom = eq[eId];
        updates['/'+int(eId+id_)] = e;
    }
    dbTeam.update(updates);
}

function randomTeam() {
    //tirage au sort ...
    resetTeam();
    let t = j_json.filter(j => {return j.eC==1});
    let p = j_json.filter(j => {return j.eC==2});
    t.sort((a,b)=>{return (a.rk-b.rk);});
    p.sort((a,b)=>{return (a.rk-b.rk);});
    let tA = t.slice(0,4);
    let tB = t.slice(4);
    let pA = p.slice(0,4);
    let pB = p.slice(4);
    eqs=[];
    for (let i = 0; i < 4;i++) {
        let eq={j1:0,j2:0};
        let j1 = random(pA);
        let i1 = pA.indexOf(j1);
        pA.splice(i1,1);
        let j2 = random(tB);
        let i2 = tB.indexOf(j2);
        tB.splice(i2,1);
        eq.j1 = j1;
        eq.j2 = j2;
        eqs.push(eq);
    }
    for (let i = 0; i < 4;i++) {
        let eq={j1:0,j2:0};
        let j1 = random(pB);
        let i1 = pB.indexOf(j1);
        pB.splice(i1,1);
        let j2 = random(tA);
        let i2 = tA.indexOf(j2);
        tA.splice(i2,1);
        eq.j1 = j1;
        eq.j2 = j2;
        eqs.push(eq);
    }    
}