let param;
let joueurs = [];
let initJoueurs = [];
let equipes = [];
let matchs = [];
let annees = [];
let inter; // intervalle entre deux ligne sur fiche joueur
let j_json, e_json, m_json, t_json;
let index = 0;
let nbMatchs;
let xM=0,yM=0;
let id = 0, idSel;
let mode = 1, debug = 0, mode_prev;
let annee, selA, phase = "Finale", poule, categories = 7;
let padding = 5;
let toggle=true;
let btTournoi,btGraphe,btRetour, btCategories=[], btInfo, btELO, btNotice;
let debounce=0;
let img_gassin, img_ramatuelle, img_saint_tropez;
let img_finale=[];
let btHTML;
let couleur_sel=0, couleur , btCouleur=[], btAnnee=[], btPhase=[], btPoule=[];
let btPM = [], btNav = [];
let couleur_arr =[
    {bk:'#03045e', dm:'#0077b6', cur:'#00b4d8', sel:'#90e0ef', txt:'#caf0f8'},
    {sel:'#FF5733',bk:'#581845',dm:'#900C3F',cur:'#C70039',tt:'#FFC300',txt:'#DAF7A6'},
    {txt:'#cad2c5', sel:'#84a98c', cur:'#52796f', dm:'#354f52', bk:'#2f3e46'},
    {txt:'#dad7cd', sel:'#a3b18a', cur:'#588157', dm:'#3a5a40', bk:'#344e41'},
    {bk:'#22223b', dm:'#4a4e69', cur:'#9a8c98', sel:'#c9ada7', txt:'#f2e9e4'},
    {bk:'#0A3214', cur:[50,200,50], dm:[50,120,50] , txt:[200,255,200], sel:[180,220,0]} ,
    {bk:'#01161e', dm:'#124559', cur:'#598392', sel:'#aec3b0', txt:'#eff6e0'},
    {bk:'#a20021', dm:'#f52f57', cur:'#f79d5c', sel:'#f3752b', txt:'#ededf4'},
    // {bk:'#230007', txt:'#d7cf07', sel:'#d98324', cur:'#a40606', dm:'#5a0002'},
    {txt:'#89d2dc', sel:'#6564db', cur:'#232ed1', dm:'#101d42', bk:'#0d1317'},
    // {dm:'#20bf55', bk:'#0b4f6c', sel:'#01baef', txt:'#fbfbff', cur:'#757575'},
    {bk:'#1d3461', dm:'#1f487e', cur:'#376996', sel:'#6290c8', txt:'#92accc'},
    // {bk:'#084b83', dm:'#42bfdd', cur:'#bbe6e4', sel:'#ffe45e', txt:'#ff66b3'}, //f0f6f6
    {bk:'#22577a', dm:'#38a3a5', cur:'#57cc99', sel:'#60cd79', txt:'#c7f9cc'},
    // {bk:'#140a32', sel:'#FFC300', dm:'#FF5733' , txt:[5,46,67], cur:'#DAF7A6'},
    {bk:'#0e0004', dm:'#31081f', cur:'#6b0f1a', sel:'#b91372' , txt:'#ffbbcc'} ]
let poules = ['Gassin', 'Ramatuelle'];
let selCat = [ {id:1 , cat:'Tireur 🔫'},{id:2, cat:'Pointeur 🪩'},{id:4, cat:'Indécis 🤔'}];

function update() {
    switch(categories) {
        case 0:
        case 7 : joueurs = initJoueurs.slice(); break;
        case 1 : joueurs = initJoueurs.filter( a => { return a.tireur > a.pointeur;}); break; //tireurs
        case 2 : joueurs = initJoueurs.filter( a => { return a.tireur < a.pointeur;}); break; //pointeurs
        case 3 : joueurs = initJoueurs.filter( a => { return a.tireur != a.pointeur;}); break;  // neutre
        case 4 : joueurs = initJoueurs.filter( a => { return a.tireur !=0 & a.pointeur != 0;}); break;
        case 5 : joueurs = initJoueurs.filter( a => { return a.tireur !=0;}); break;
        case 6 : joueurs = initJoueurs.filter( a => { return a.pointeur != 0;}); break;
    }
}
function update_color(n) {
    couleur_sel=int(n);
    couleur=couleur_arr[n];
    select('body').style('background-color',couleur.bk);
    select('body').style('color',couleur.txt);
    select('.entete').style('background-color',couleur.bk);
    selectAll('.notice').forEach( a => a.style('background-color',couleur.bk));
}
function update_PM(n) {
    let c =int(n /2), d=n%2;
    const HH=1; LL=0.05;
    switch (c) {
        case 0 : if (d) { param.ELO.init -= HH; } else {param.ELO.init += HH;}; break;
        case 1 : if (d) { param.ELO.seuil -= HH; } else {param.ELO.seuil += HH;}; break;
        case 2 : if (d) { param.ELO.std -= LL; } else {param.ELO.std += LL;}; break;
        case 3 : if (d) { param.ELO.demi -= LL; } else {param.ELO.demi += LL;}; break;
        case 4 : if (d) { param.ELO.finaliste -= LL; } else {param.ELO.finaliste += LL;}; break;
        case 5 : if (d) { param.ELO.finale -= LL; } else {param.ELO.finale += LL;}; break;
        case 6 : if (d) { param.ELO.bonusSeuil -= HH; } else {param.ELO.bonusSeuil += HH;}; break;
        case 7 : if (d) { param.ELO.bonus -= LL; } else {param.ELO.bonus += LL;}; break;
    }
    calculELO(false);
}
function update_Nav(n) {
    console.log(int(n));
    switch(int(n)) {
        case 0 : id=max(0,id - 1) ; break;
        case 2 : id=(id+1) % joueurs.length;break;
        case 1 : mode = 0 ; console.log('retour') ;break;
    }
}
function setCat(id_=1) {
    categories = categories ^ id_;
    id = 0;
    update();
}
function BtTournoi() {
    joueurs = initJoueurs.slice();
    mode = (mode + 1) %2;
    id=0;
    update();
}
function BtGraphe() {
    mode = mode ^ 3;
    update();
}
function HTMLRetour() {
    select('canvas').show();
    select('#notice').style('display','hidden');
    select('#ELO').style('display','hidden');
    toggle = true;
}
function setPhase(id_) {
    phase = t_json[id_].type;
    // poule = poules[0]; btPoule[0].setOn();
    setPoule(0);
    for (let i in btPhase) {
        c = btPhase[i];
        if (i == id_) { c.setOn();} else { c.setOff();}
    }
}
function setPoule(id_) {
    poule = poules[id_];
    for (let i in btPoule) {
        c = btPoule[i];
        if (i == id_) { c.setOn();} else { c.setOff();}
    }
}
function setDateSel(id_) {
    annee = annees[id_].a;
    index = annees[id_].m;
    for (let i in annees) {
        c = btAnnee[i];
        if (annees[i].a == annee) { c.setOn();} else { c.setOff();}
    }
}
function keyPressed() {
    if (key=='w') { BtTournoi();}
    if (key=='d') { debug = (debug+1)%2;}
}
function preload() {
    param = loadJSON("./data/param.json");
    j_json = loadJSON("./data/joueurs.json");
    e_json = loadJSON("./data/equipes.json");
    m_json = loadJSON("./data/matchs.json");
    t_json = loadJSON("./data/type.json");
    img_gassin = loadImage("./img/gassin.png"); //130x143
    img_ramatuelle = loadImage("./img/ramatuelle.png"); //130x143
    img_saint_tropez = loadImage("./img/saint-tropez.png"); //130x143
    let img=loadImage("./img/2023.jpeg");
    img_finale.push({a:2023,i:img}); //1024x768
    img=loadImage("./img/2022.JPG");
    img_finale.push({a:2022,i:img}); //1024x768
}
function readNotice() {
    btHTML = select("#retour1");
    btHTML.mousePressed(HTMLRetour);
    if (toggle) {
        select("canvas").hide();
        select("#notice").style('display','block');
        select("#ELO").style('display','none');
        toggle = false;
    }
}
function readELO() {
    btHTML = select("#retour2");
    btHTML.mousePressed(HTMLRetour);
    if (toggle) {
        select("canvas").hide();
        select("#notice").style('display','none');
        select("#ELO").style('display','block');
        toggle = false;
    }
}
function drawParam() {
    // a compléter ...
    let x = 30, x1 = width*2/3;
    let y = 80;
    let dy = 20;
    textAlign(LEFT,CENTER); fill(color(couleur.bk)); textSize(12); textStyle(NORMAL);
    text('Score initial ELO (nouvau joueur) :',x,y); text(param.ELO.init+' pts',x1,y); y += dy;
    text('Limitation du gain au delà de ',x,y); text(param.ELO.seuil+' pts',x1,y); y += dy;
    text('Coefficient match normal :',x,y); text(nf(param.ELO.std,0,2)+' pts',x1,y); y += dy;
    text('Coefficient en "demi" :',x,y); text(nf(param.ELO.demi,0,2)+' pts',x1,y); y += dy;
    text('Coefficient phases finales :',x,y); text(nf(param.ELO.finaliste,0,2)+' pts',x1,y); y += dy;
    text('Coefficient pour la FINALE :',x,y); text(nf(param.ELO.finale,0,2)+' pts',x1,y); y += dy;
    text('Ecart pour un coef. de majoration:',x,y); text(param.ELO.bonusSeuil+' pts',x1,y); y += dy;
    text('Coefficient de majoration :',x,y); text(nf(param.ELO.bonus,0,2)+' pts',x1,y); y += dy;
    y += 2*dy;
    let y_ = y;
    for (let i in couleur_arr) {
        i = int(i);
        fill(color(couleur_arr[i].bk));rect(x1-140,y-7,15,14);text('Palette '+i+((i==couleur_sel)?' ➡️':''),x,y);
        fill(color(couleur_arr[i].dm));rect(x1-120,y-7,15,14); 
        fill(color(couleur_arr[i].cur));rect(x1-100,y-7,15,14);
        fill(color(couleur_arr[i].sel));rect(x1-80,y-7,15,14);
        fill(color(couleur_arr[i].txt));rect(x1-60,y-7,15,14);
        y += dy;
    }
    y = y_;
    for (let i in btCouleur) {
        btCouleur[i].redim(width-30,y,10);
        fill(color(couleur_arr[i].dm));rect(width-40,y-8,16,16,2);
        y += dy;
    }
    y = 100;
}
function drawDateBar() {
    let x = padding, y = padding+55;
    let dx = (width-2*padding) / matchs.length , dy=15;
    for (let i=0; i<matchs.length; i++) {
        if (i==index) {
            fill(color(couleur.sel));
        } else {
            if (matchs[i].type=="Poule") fill(color(couleur.bk));
            if (matchs[i].type=="Demi") fill(color(couleur.dm));
            if (matchs[i].type.indexOf("Finale") != -1) fill(color(couleur.cur));
        }
        rect(x+i*dx,y,dx,dy);
    }
}
function showMatch() {
    let x = padding;
    let y = height-14*padding;
    let m = matchs[index];
    let e1 = m.equipes[0].eq;
    let e2 = m.equipes[1].eq;
    // let mid = 5*(width-2*padding)/8, dt = 20;
    let mid = (width-2*padding)/2, dt = 24;
    let s2 = (width*3/4) * 0.07 +1;
    let w2 = (width-2*padding)/2  - s2 - padding;
    fill(color(couleur.bk));
    textAlign(CENTER,CENTER);
    text(m.type,x+mid,y);
    let sc1 = m.equipes[0].sc, sc2=m.equipes[1].sc;
    drawScore(e1,e2,sc1,sc2,0,y,mid,s2,dt,w2);
}
function windowResized() {
    let h_ = innerHeight*0.98;
    let w_ = min(0.59*h_, innerWidth);
    resizeCanvas(w_,h_);
    let x_ = (windowWidth - width) / 2;
    let y_ = (windowHeight - height) / 2;
    select('canvas').position(x_, y_+10);
    // canvas.position(x_, y_+10);
    let r_=18;
    y_ = height-r_/2-padding;
    x_ = padding+r_/2;
    let l_ = (width-padding-r_)/4;
    btGraphe.redim(x_,y_,l_);
    btInfo.redim(width/2,y_,25,25);
    x_ = 3*(width-padding)/4;
    l_ = (width-4*padding)/4;
    btTournoi.redim(x_,y_,l_);
    x_ = (width-2*padding)/2;
    l_ = (width-padding)/4;
    btRetour.redim(x_,y_,l_);
    let dx_ = (width - 2* padding) / 3;
    x_ = r_, y_ = 40;
    for (let p of btCategories) {
        p.redim(x_,y_,dx_-padding,dx_-padding);
        x_ += dx_;
    }
}

function setup() {
    let h_ = innerHeight*0.98;
    let w_ = min(0.59*h_, innerWidth);
    canvas = createCanvas(w_,h_); // mise en place du ratio 0.59
    canvas.parent("#canvas");
    let x = (windowWidth - width) / 2;
    let y = (windowHeight - height) / 2;
    canvas.position(x, y+10);
  
    for (let i in j_json) {
        let j = j_json[i];
        joueurs.push( new Joueur(j.nom,j.id));
        // iDs.push(i);
    }
    for (let i in e_json) {
        let e = e_json[i];
        equipes.push( new Equipe(e.nom,joueurs[e.J1],joueurs[e.J2],e.annee));
    }
    nbMatchs = Object.keys(m_json).length ;
    calculELO(true);
    poule = poules[0];
    createButtons();
    setDateSel(annees.length-1);
    select("#notice").style('display','none');
    select("#ELO").style('display','none');
    update_color(0);
}
function draw() {
    background(220);
    noStroke();
    showButtons();
    if (mode == 3) {
        fill(color(couleur.bk));
        rect(padding,79,width-2*padding,height-155);
        for (let i in joueurs) {
            let idx = int(joueurs[i].hist[index].c);
            let elo = joueurs[i].hist[index].elo;
            joueurs[i].draw(idx,initJoueurs.length,width-2*padding,height-155,elo);
        }
    }
    if (mode==0) {
        joueurs.sort( (a,b) => { return (b.hist[index].elo - a.hist[index].elo);});
        let w_ = width-2*padding;
        let dx = w_/12;
        let x_ = padding + 2*8 +3.5*dx;
        let y_ = 67, dy_=18;
        inter = int((height-120)/initJoueurs.length);
        noFill();
        stroke(color(couleur.bk));
        rect(x_+1,y_-dy_/2+1,dx-2,dy_-2);
        rect(x_+1*dx,y_-dy_/2+1,dx-2,dy_-2);
        rect(x_+2*dx,y_-dy_/2+1,dx-2,dy_-2);
        rect(x_+3*dx,y_-dy_/2+1,dx-2,dy_-2);
        rect(x_+4*dx,y_-dy_/2+1,dx-2,dy_-2);
        rect(x_+5*dx,y_-dy_/2+1,dx-2,dy_-2);
        textAlign(CENTER,CENTER);textStyle(NORMAL);
        textSize(int(inter/2.5));
        fill(color(couleur.bk));
        text('ELO',x_+1+dx/2, y_);
        text('G',x_+dx+dx/2, y_);
        text('N',x_+2*dx+dx/2, y_);
        text('P',x_+3*dx+dx/2, y_);
        // textSize(10);
        text('po',x_+4*dx+dx/2, y_);
        text('co',x_+5*dx+dx/2, y_);
        text('---'+inter+'----',100,height-50);
        for (let i in joueurs) {
            let idx = int(joueurs[i].hist[index].c);
            let elo = joueurs[i].hist[index].elo;
            // iDs[i] = idx;
            joueurs[i].show(idx, padding, inter*(i)+85, w_,elo);
        }
    }
    if (mode==2) {
        btNav[0].redim(width/10,height-14-padding,14);
        btNav[1].redim(width/2,height-14-padding,14);
        btNav[2].redim(width*9/10,height-14-padding,14);
            joueurs[id].fiche(padding,40,width-2*padding,matchs);
    }
    if (mode==4) drawParam();
    if (mode==1) drawTournois(0,40,width, height-100,annee);
    if (mode==3) {
        drawDateBar();
        showMatch(index);
    }
    textAlign(LEFT,CENTER); fill(0); textSize(8); textStyle(NORMAL);
    text(mode,width-10,height-10);
}
