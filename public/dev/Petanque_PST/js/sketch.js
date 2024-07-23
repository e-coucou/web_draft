let joueurs = [];
let initJoueurs = [];
let equipes = [];
let matchs = [];
let annees = [];
let iDs = [];
let j_json, e_json, m_json;
let index = 0;
let nbMatchs;
let xM=0,yM=0;
let id = 0, idSel;
let mode = 1, debug = 0;
let annee, selA;
let w,h;
let padding = 24;
let bt_tireur, bt_pointeur, bt_egal, bt_all;
let bt_switch;

let couleur = {bk:[10,50,20], bg:[30,70,30], sel:[50,200,50], pl:[20,80,20], dm:[50,120,50] , f:[60,140,70], cur:[200,200,20]};

function mousePressed() {
    if (mouseX>(width-205) && mouseX<width) {
        let id_ = round((mouseY - 80) / 20);
        if ( id_<0 || id_>=joueurs.length) {
                console.log('oup');
            } else {
                id = iDs[id_];
            }
    }
    // Selction de l'année
    if (mouseX>padding && mouseX<(w+padding) && mouseY<padding) {
        let id_ = floor((mouseX-padding) / (w / annees.length));
        selA = id_;
        setDateSel(selA);
    }
    // Selection du joueur (cote en Y modulo le nb de joueurs)
    if (mouseX>(padding) && mouseX<(w+padding) && mouseY>(padding) && mouseY<(h+padding) && mode==0) {
        let id_ = floor((mouseY-padding) / (h / joueurs.length));
        id=iDs[id_];
    }
    // Selection du match par la bande inférieure
    if (mouseX>(padding) && mouseX<(w+padding) && mouseY>(h+padding) && mouseY<(h+padding+10) && mode==0) {
        console;log('ici');
        let id_ = floor((mouseX-padding) / (w / matchs.length));
        index = id_;
        annee = matchs[id_].annee;
    }
    if (mouseX>=(width-40) && mouseX<width && mouseY>=(height-40)) {
        BSwitch();
    }
    if (mouseX>=(width-100) && mouseX<(width-60) && mouseY>=(height-40)) {
        debug = (debug + 1) %2;
    }
}
function mouseMoved() {
    xM = max(padding,min(mouseX,w+padding));
    yM = max(padding,min(mouseY,h+padding));
    if (mouseX>(padding) && mouseX<(w+padding) && mouseY>(h+padding) && mouseY<(h+padding+10) && mode==0) {
        let id_ = floor((mouseX-padding) / (w / matchs.length));
        index = id_;
        annee = matchs[id_].annee;
    }
    // if (mouseX>(padding) && mouseX<(w+padding) && mouseY>(padding) && mouseY<(h+padding) && mode==0) {
    //     let id_ = floor((mouseY-padding) / (h / joueurs.length));
    //     console.log(id_);
    //     id=id_;
    // } 
}
function setDateSel(id_) {
    annee = annees[id_].a;
    index = annees[id_].m;
}

function keyPressed() {
    if (key=='a') {
        setDateSel(0);
    }
    if (key=='z') {
        setDateSel(1);
    }
    if (key=='e') {
        setDateSel(2);
    }
    if (key=='r') {
        setDateSel(3);
    }
    if (key=='w') { BSwitch();}
    if (key=='d') { debug = (debug+1)%2;}
}

function preload() {
    j_json = loadJSON("./data/joueurs.json");
    e_json = loadJSON("./data/equipes.json");
    m_json = loadJSON("./data/matchs.json");
}
function drawDate() {
    let dx = w / annees.length;
    let x = dx/2 + padding, y = 12;
    textAlign(CENTER,CENTER);
    for (let a of annees) {
        if (a.a==annee) {
            fill(color(couleur.sel));
        } else {
            fill(color(couleur.bk));
        }
        rect(x-dx/2+1,y-12,dx-2,24);
        fill(255);
        text(a.a,x,y);
        x += dx;
    }
}
function drawDateBar() {
    let x_ = padding, y_ = padding+h;
    let dx = w / matchs.length , dy=10;
    for (let i=0; i<matchs.length; i++) {
        if (i==index) {
            fill(color(couleur.cur));
        } else {
            if (matchs[i].type=="Poule") fill(color(couleur.pl));
            if (matchs[i].type=="Demi") fill(color(couleur.dm));
            if (matchs[i].type.indexOf("Finale") != -1) fill(color(couleur.f));
        }
        rect(x_+i*dx,y_,dx,dy);
    }
}
function pouleClst(m) {
    let clt = [];
    for (let i =0; i<m.length;i++) {
        for (let j=0;j<2;j++) {
            let e = m[i].equipes[j].eq.nom;
            let p = m[i].equipes[j].sc;
            let c = m[i].equipes[(j+1)%2].sc;
            let d = p - c;
            let g = 1;
            if (p>c) g=3;
            if (p<c) g=0;
            let a = {n:e, p:p, c:c , s:g, d:d};
            clt.push(a);
        }
    }
    // console.log(a);
    let u1 = [...new Set(clt.map(a => a.n ))];
    let b = [];
    u1.forEach( a => {  let res =  clt.filter( c => {return (c.n==a)}) ; b.push(res); } );
    let r =[];
    for (let i=0; i<b.length ; i++) {
        let p = b[i].reduce((a,b) =>{ return a+b.p}, 0);
        let c = b[i].reduce((a,b) =>{ return a+b.c}, 0);
        let s = b[i].reduce((a,b) =>{ return a+b.s}, 0);
        let d = b[i].reduce((a,b) =>{ return a+b.d}, 0);
        r.push({n:u1[i], p:p , c:c, s:s, d:d})
    }
    r.sort((a,b) => {return b.p - a.p;});
    r.sort((a,b) => {return b.d - a.d;});
    r.sort((a,b) => {return b.s - a.s;});
    return r;

}
function showMatch() {
    let x = padding;
    let y = h+padding-30;
    let m = matchs[index];
    let e1 = m.equipes[0].eq;
    let e2 = m.equipes[1].eq;
    let mid = 3*w/4+15, dt = 25;
    fill(200);
    textAlign(CENTER,CENTER);
    text(m.type,x+mid,y);
    fill(120,180,120);
    let sc1 = m.equipes[0].sc, sc2=m.equipes[1].sc;
    if (sc1>=sc2) {
        fill(color(couleur.sel));
        rect(x+mid-dt+1,y+10,dt-4,18);
    }
    if (sc2>=sc1) {
        fill(color(couleur.sel));
        rect(x+mid+3,y+10,dt-4,18);
    }
    fill(color(couleur.bk));
    rect(x+mid-157,y+10,137,18)
    rect(x+mid+20,y+10,137,18)
    let e1_t = e1.tireur.nom+'/'+e1.pointeur.nom+' '+e1.nom;
    let e2_t = e2.nom+' '+e2.tireur.nom+'/'+e2.pointeur.nom;
    fill(255);
    textAlign(CENTER,CENTER);
    text(sc1,x+mid-dt/2,y+20);
    text(sc2,x+mid+dt/2,y+20);
    text('-',x+mid,y+20);
    textAlign(RIGHT,CENTER);
    text(e1_t,x+mid-dt,y+20);
    textAlign(LEFT,CENTER);
    text(e2_t,x+mid+dt,y+20);
}
function drawConcours(x_, y_ ,a_) {
    let x = x_+padding;
    let y = y_;
    let m = matchs.filter( r => { return ( r.annee == a_);});
    fill(200);
    textAlign(LEFT,CENTER);
    textSize(12);
    text('GASSIN',x,y); y += 25;
    fill(255);
    let p = m.filter( r => { return ( r.type == "Poule" && r.poule=="Gassin"); });
    for (let i in p ) {
        let e1 = p[i].equipes[0].eq;
        let e2 = p[i].equipes[1].eq;
        text(e1.nom+' '+p[i].equipes[0].sc+' - '+p[i].equipes[1].sc+' '+e2.nom,x,y+i*22);
    }
    let r = pouleClst(p);
    y += 150;
    text('classement',x,y); y +=20;
    for (let i=0; i<r.length;i++ ) {
        // text(r[i].n+' : '+r[i].s+'pts '+r[i].p+' '+r[i].c+' ',r[i].d,x,y+i*18);
        text(r[i].n+' : '+r[i].s+'pts +'+r[i].p+' -'+r[i].c+' ('+r[i].d+')',x,y+i*18);
    }
    // y += 15 + 6*22;
    x = w + padding - x_;
    y = y_;
    fill(200);
    textAlign(RIGHT,CENTER)
    text('RAMATUELLE',x,y); y += 25;
    fill(255);
    p = m.filter( r => { return ( r.type == "Poule" && r.poule=="Ramatuelle"); });
    for (let i in p ) {
        let e1 = p[i].equipes[0].eq;
        let e2 = p[i].equipes[1].eq;
        text(e1.nom+' '+p[i].equipes[0].sc+' - '+p[i].equipes[1].sc+' '+e2.nom,x,y+i*22);
    }
    r = pouleClst(p);
    y += 150;
    text('classement',x,y); y +=20;
    for (let i=0; i<r.length;i++ ) {
        text(r[i].n+' : '+r[i].s+'pts +'+r[i].p+' -'+r[i].c+' ('+r[i].d+')',x,y+i*18);
    }
    x = padding;
    y = y_;
    fill(200);
    textAlign(CENTER,CENTER);
    text('Demi Finale',x+w/2,y); y += 10;
    p = m.filter( r => { return ( r.type == "Demi"); });
    fill(255);
    for (let i=0;i<p.length;i++ ) {
        let e1 = p[i].equipes[0].eq;
        let e2 = p[i].equipes[1].eq;
        let mid = w/2, dt = 25;
        fill(120,180,120);
        let sc1 = p[i].equipes[0].sc, sc2=p[i].equipes[1].sc;
        if (sc1>=sc2) {
            fill(color(couleur.sel));
            rect(x+mid-dt+1,y+(i+1)*20-10,dt-4,18);
        }
        if (sc2>=sc1) {
            fill(color(couleur.sel));
            rect(x+mid+3,y+(i+1)*20-10,dt-4,18);
        }
        fill(color(couleur.bk));
        rect(x+mid-190,y+(i+1)*20-10,170,18)
        rect(x+mid+20,y+(i+1)*20-10,170,18)
        let e1_t = e1.tireur.nom+'/'+e1.pointeur.nom+' '+e1.nom;
        let e2_t = e2.nom+' '+e2.tireur.nom+'/'+e2.pointeur.nom;
        fill(255);
        textAlign(CENTER,CENTER);
        text(sc1,x+mid-dt/2,y+(i+1)*20);
        text(sc2,x+mid+dt/2,y+(i+1)*20);
        text('-',x+mid,y+(i+1)*20);
        textAlign(RIGHT,CENTER);
        text(e1_t,x+mid-dt,y+(i+1)*20);
        textAlign(LEFT,CENTER);
        text(e2_t,x+mid+dt,y+(i+1)*20);
    }
    // Les finales
    y = y_ + 130;
    x = padding;
    p = m.filter( r => { return ( r.type != "Demi"  && r.type != "Poule" ); });
    let mid = w/2, dt = 25;
    for (let i=0; i<p.length ; i++ ) {
        let j = p.length-i-1;
        let e1 = p[i].equipes[0].eq;
        let e2 = p[i].equipes[1].eq;
        fill(120,180,120);
        fill(200);
        textAlign(CENTER,CENTER);
        text(p[i].type,x+mid,y+(3*j)*17);
        let sc1 = p[i].equipes[0].sc, sc2=p[i].equipes[1].sc;
        if (sc1>=sc2) {
            fill(color(couleur.sel));
            rect(x+mid-dt+1,y+(3*j+1)*17-10,dt-4,20);
        }
        if (sc2>=sc1) {
            fill(color(couleur.sel));
            rect(x+mid+3,y+(3*j+1)*17-10,dt-4,20);
        }
        let e1_t = e1.tireur.nom+'/'+e1.pointeur.nom+' '+e1.nom;
        let e2_t = e2.nom+' '+e2.tireur.nom+'/'+e2.pointeur.nom;
        fill(color(couleur.bk));
        rect(x+mid-190,y+(3*j+1)*17-10,170,20)
        rect(x+mid+20,y+(3*j+1)*17-10,170,20)
        fill(255);
        textAlign(CENTER,CENTER);
        text('-',x+mid,y+(3*j+1)*17);
        text(sc1,x+mid-dt/2,y+(3*j+1)*17);
        text(sc2,x+mid+dt/2,y+(3*j+1)*17);
        textAlign(RIGHT,CENTER);
        text(e1_t,x+mid-dt,y+(3*j+1)*17);
        textAlign(LEFT,CENTER);
        text(e2_t,x+mid+dt,y+(3*j+1)*17);
    }
}
function setup() {
    canvas = createCanvas(innerWidth*0.99,700);
    canvas.parent("#canvas");

    for (let i in j_json) {
        let j = j_json[i];
        joueurs.push( new Joueur(j.nom,j.id));
        iDs.push(i);
    }
    for (let i in e_json) {
        let e = e_json[i];
        equipes.push( new Equipe(e.nom,joueurs[e.J1],joueurs[e.J2],e.annee));
    }
    nbMatchs = Object.keys(m_json).length ;
    let a_ = false;
    for (let i in m_json) {
        let m = m_json[i];
        // console.log(m.annee);
        matchs.push( new Match(i,equipes[m.E1],equipes[m.E2],m.Sc1,m.Sc2,m.type, m.annee, m.poule));
        joueurs.sort( (a,b) => { return (b.ELO - a.ELO) ;});
        if (m.type == "Finale") {
            a_=true;
            annees.push({a:m.annee,m:int(i)});
        }
        for (let j in joueurs) {
            joueurs[j].setClst(j,a_,m.annee);
        }
        a_ = false;
    }

    // frameRate(1);
    selA = annees.length-1;
    setDateSel(selA);
    w = (width-260)*1.;
    h = (height-padding)*0.5;

    bt_tireur = createButton("Tireur");
    bt_tireur.parent('bt_tireur');
    bt_tireur.mousePressed(Btireur);
    bt_pointeur = createButton("Pointeur");
    bt_pointeur.parent('bt_pointeur');
    bt_pointeur.mousePressed(Bpointeur);
    bt_egal = createButton("Neutre");
    bt_egal.parent('bt_egal');
    bt_egal.mousePressed(Begal);
    bt_all = createButton("TOUS");
    bt_all.parent('bt_all');
    bt_all.mousePressed(Ball);
    bt_switch = createButton("Switch View");
    bt_switch.parent('bt_switch');
    bt_switch.mousePressed(BSwitch);

    initJoueurs = joueurs.slice();
}

function Btireur() {
    joueurs = initJoueurs.filter( a => { return a.tireur > a.pointeur;})
    id=1;
}
function Bpointeur() {
    joueurs = initJoueurs.filter( a => { return a.tireur < a.pointeur;})
    id=1;
}
function Begal() {
    joueurs = initJoueurs.filter( a => { return a.tireur == a.pointeur;})
    id=1;
}
function Ball() {
    joueurs = initJoueurs.slice();
    id=1;
}
function BSwitch() {
    joueurs = initJoueurs.slice();
    mode = (mode + 1) %2;
    id=1;
}
function draw() {
    background(220);
    idSel = joueurs[id].id;
    fill(color(couleur.bk));
    circle(width-20,height-20,25);
    circle(width-80,height-20,25);
    fill(color(couleur.bk));
    textAlign(CENTER,CENTER);
    textSize(36);
    text(matchs[index].annee, width-130+padding, 25);
    textSize(14);
    text(matchs[index].type, width-130+padding, 55);

    noStroke();
    fill(color(couleur.bg));
    rect(padding,padding,w,h);

    drawDate();

    for (let i in joueurs) {
        let idx = int(joueurs[i].hist[index].c);
        let elo = joueurs[i].hist[index].elo;
        iDs[idx-1] = i;
        joueurs[i].show(idx, width-205, 20*(idx-1)+80,elo);
        if (mode==0) {
            joueurs[i].draw(idx,joueurs.length,w,h,elo);
        }
    }
    if (mode==1) drawConcours(20,40,annee);
    if (mode==0) {
        drawDateBar();
        showMatch(index);
    }
    // if (frameCount % 5 == 0) {
    //     if (index<nbMatchs-1) {
    //         index += 1;
    //     }
    // }
    if (id != -1) {
        joueurs[id].fiche(padding,height/2,w,matchs);
    }
    stroke(130);
    line(padding,yM,w+padding,yM);
    line(xM,padding,xM,h+padding);
}
