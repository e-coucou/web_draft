let joueurs = [];
let equipes = [];
let matchs = [];
let j_json, e_json, m_json;
let index = 0;
let nbMatchs;
let xM=0,yM=0;
let id = -1;
let mode = 1;
let annee = 2023;

function mousePressed() {
    if (mouseX>(width-205) && mouseX<width) {
        id = round((mouseY - 80) / 20);
        if ( id<0 || id>=joueurs.length) id=-1;
        // console.log(joueurs[id]);
    }
}

function keyPressed() {
    if (key=='a') {
        annee = 2020;
    }
    if (key=='z') {
        annee = 2021;
    }
    if (key=='e') {
        annee = 2022;
    }
    if (key=='r') {
        annee = 2023;
    }
    if (key=='w') {
        mode = (mode+1)%2;
    }
}

function mouseMoved() {
    xM = min(mouseX,width-195);
    yM = min(mouseY,height-50);
}
function preload() {
    j_json = loadJSON("./data/joueurs.json");
    e_json = loadJSON("./data/equipes.json");
    m_json = loadJSON("./data/matchs.json");
}

function drawConcours(x_, y_ ,a_) {
    let x = x_;
    let y = y_;
    let m = matchs.filter( r => { return ( r.annee == a_);});
    fill(255);
    textAlign(LEFT,CENTER);
    textSize(12);
    text('GASSIN',x,y); y += 25;
    let p = m.filter( r => { return ( r.type == "Poule" && r.poule=="Gassin"); });
    for (let i in p ) {
        let e1 = p[i].equipes[0].eq;
        let e2 = p[i].equipes[1].eq;
        text(e1.nom+' '+p[i].equipes[0].sc+' - '+p[i].equipes[1].sc+' '+e2.nom,x,y+i*22);
    }
    y += 15 + 6*22;
    text('RAMATUELLE',x,y); y += 25;
    p = m.filter( r => { return ( r.type == "Poule" && r.poule=="Ramatuelle"); });
    for (let i in p ) {
        let e1 = p[i].equipes[0].eq;
        let e2 = p[i].equipes[1].eq;
        text(e1.nom+' '+p[i].equipes[0].sc+' - '+p[i].equipes[1].sc+' '+e2.nom,x,y+i*22);
    }
    x += 100;
    y = y_;
    text('Demi Finale',x,y); y += 30;
    p = m.filter( r => { return ( r.type == "Demi"); });
    for (let i in p ) {
        let e1 = p[i].equipes[0].eq;
        let e2 = p[i].equipes[1].eq;
        text(e1.nom+' '+p[i].equipes[0].sc+' - '+p[i].equipes[1].sc+' '+e2.nom,x,y+i*25);
    }
    y = y_ + 145;
    p = m.filter( r => { return ( r.type != "Demi"  && r.type != "Poule" ); });
    let mid = 180, dt = 25;
    for (let i=0; i<p.length ; i++ ) {
        let j = p.length-i-1;
        let e1 = p[i].equipes[0].eq;
        let e2 = p[i].equipes[1].eq;
        fill(120,180,120);
        rect(x+mid-dt+1,y+(3*j+1)*17-10,dt*2-2,20)
        fill(200);
        textAlign(CENTER,CENTER);
        text(p[i].type,x+mid,y+(3*j)*17);
        let sc = ' '+p[i].equipes[0].sc+' - '+p[i].equipes[1].sc+' ';
        let e1_t = e1.tireur.nom+'/'+e1.pointeur.nom+' '+e1.nom;
        let e2_t = e2.nom+' '+e2.tireur.nom+'/'+e2.pointeur.nom;
        fill(255);
        textAlign(RIGHT,CENTER);
        text(e1_t,x+mid-dt,y+(3*j+1)*17);
        textAlign(CENTER,CENTER);
        text(sc,x+mid,y+(3*j+1)*17);
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
        if (m.type == "Finale") a_=true;
        for (let j in joueurs) {
            joueurs[j].setClst(j,a_,m.annee);
        }
        a_ = false;
    }
    // frameRate(1);
    index=0;
}


function draw() {
    background(220);
    fill(10,50,10);
    textAlign(CENTER,CENTER);
    textSize(36);
    text(matchs[index].annee, width-100, 25);
    textSize(14);
    text(matchs[index].type, width-100, 55);

    let w = (width-300)*1.;
    let h = (height-40)*0.5;
    fill(40,80,40);
    noStroke();
    rect(25,20,w+20,h+20);
    for (let i in joueurs) {
        let idx = joueurs[i].hist[index].c;
        let elo = joueurs[i].hist[index].elo;
        joueurs[i].show(idx, width-205, 20*(idx-1)+80);
        if (mode==0) {
            joueurs[i].draw(idx,joueurs.length,w,h,elo);
        }
    }
    if (mode==1) drawConcours(40,40,annee);
    if (frameCount % 5 == 0) {
        if (index<nbMatchs-1) {
            index += 1;
        }
    }
    if (id != -1) {
        joueurs[id].fiche(25,height/2,w,matchs);
    }
    stroke(130);
    line(0,yM,width-200,yM);
    line(xM,0,xM,height-50);
}
