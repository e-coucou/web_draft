let start = 0x0F, startOnce=true;

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