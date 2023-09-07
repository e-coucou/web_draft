let param;
let joueurs = [];
let initJoueurs = [];
let equipes = [];
let matchs = [];
let annees = [];
let iDs = [];
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
let couleur_sel=0, couleur , btCouleur=[];
let btPM = [];
let couleur_arr =[
    {sel:'#FF5733',bk:'#581845',dm:'#900C3F',cur:'#C70039',tt:'#FFC300',txt:'#DAF7A6'},
    {bk:'#03045e', dm:'#0077b6', cur:'#00b4d8', sel:'#90e0ef', txt:'#caf0f8'},
    {txt:'#cad2c5', sel:'#84a98c', cur:'#52796f', dm:'#354f52', bk:'#2f3e46'},
    {txt:'#dad7cd', sel:'#a3b18a', cur:'#588157', dm:'#3a5a40', bk:'#344e41'},
    {bk:'#22223b', dm:'#4a4e69', cur:'#9a8c98', sel:'#c9ada7', txt:'#f2e9e4'},
    {bk:'#0A3214', cur:[50,200,50], dm:[50,120,50] , txt:[200,255,200], sel:[180,220,0]} ,
    {bk:'#01161e', dm:'#124559', cur:'#598392', sel:'#aec3b0', txt:'#eff6e0'},
    {bk:'#a20021', dm:'#f52f57', cur:'#f79d5c', sel:'#f3752b', txt:'#ededf4'},
    {bk:'#230007', txt:'#d7cf07', sel:'#d98324', cur:'#a40606', dm:'#5a0002'},
    {txt:'#89d2dc', sel:'#6564db', cur:'#232ed1', dm:'#101d42', bk:'#0d1317'},
    {dm:'#20bf55', bk:'#0b4f6c', sel:'#01baef', txt:'#fbfbff', cur:'#757575'},
    {bk:'#1d3461', dm:'#1f487e', cur:'#376996', sel:'#6290c8', txt:'#92accc'},
    {bk:'#084b83', dm:'#42bfdd', cur:'#bbe6e4', sel:'#ffe45e', txt:'#ff66b3'}, //f0f6f6
    {bk:'#22577a', dm:'#38a3a5', cur:'#57cc99', sel:'#60cd79', txt:'#c7f9cc'},
    {bk:'#140a32', sel:'#FFC300', dm:'#FF5733' , txt:[5,46,67], cur:'#DAF7A6'},
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
function mousePressed() {
    // Mode 0 = Liste
    // Mode 1 = Tournoi
    // Mode 2 = Fiche
    // Mode 3 = GrapheX
    // Mode 4 = Param
    //
    if ( (frameCount-debounce > 10) ) {
        debounce = frameCount;
        //     // Selction de la categorie du joueur /Tireur/Pointeur/Indifférent
        for( let n in btCategories) {
            let c = btCategories[n];
            if (c.isIn(mouseX,mouseY,mode)) {
                let id_ = selCat[n].id;
                c.setSW(setCat,id_);
            }
        }
        //     // Selction de la couleur
        for( let n in btCouleur) {
            let c = btCouleur[n];
            if (c.isIn(mouseX,mouseY,mode)) {
                update_color(n);
            }
        }
        //    Boutons  +/-  de Param
        for( let n in btPM) {
            let b = btPM[n];
            if (b.isIn(mouseX,mouseY,mode)) {
                update_PM(n);
            }
        }
        // selection switch Tournoi/Liste
        if (btTournoi.isIn(mouseX,mouseY,mode)) { btTournoi.setSW(BtTournoi); }
        // selection Bouton de retour
        if (btRetour.isIn(mouseX,mouseY,mode)) {  mode=mode_prev; toggle=true; btTournoi.setOff();}
        // slecture de la notice / read ELO explication
        if (btNotice.isIn(mouseX,mouseY,mode)) { readNotice(); }
        if (btELO.isIn(mouseX,mouseY,mode)) { readELO(); }
        // Selection de l'année
        if (mode==0 || mode==1 || mode == 3 || mode==2 ) {
            if (mouseX>padding && mouseX<(width-padding) && mouseY<24 && mouseY>0) {
                let id_ = floor((mouseX-padding) / ((width+2*padding) / annees.length));
                if (mode < 2 || mode==3) {
                    selA = id_;
                    setDateSel(selA);
                }
            }
        }
        // selection d'un joueur dans la liste
        if (mouseX>(padding) && mouseX<(width-padding) && mode==0) {
            let id_ = round((mouseY - 80) / 20);
            if ( id_<0 || id_>=joueurs.length) {
                mode=0;
            } else {
                id = id_;
                mode_prev = mode;
                mode = 2;
            }
        }
        if (btGraphe.isIn(mouseX,mouseY,mode)) {
            mode_prev = mode;
            btGraphe.setSW(BtGraphe);
        }    
        if (btInfo.isIn(mouseX,mouseY,mode)) {
            mode_prev = mode; mode = 4;
        }    
        if (mode==1) {
            // Selection de la phase
            if (mouseX>padding && mouseX<(width-padding) && mouseY<52 && mouseY>26) {
                let id_ = floor((mouseX-padding) / ((width+2*padding) / 3));
                phase = t_json[id_].type;
                poule = poules[0];
            }
            // Selection de la poule
            if (mouseX>padding && mouseX<(width-padding) && mouseY<79 && mouseY>54) {
                let id_ = floor((mouseX-padding) / ((width+2*padding) / 2));
                poule = poules[id_];
            }
        }
        // Selection du match par la bande colorée (meme emplacement que sel Poule)
        if (mouseX>(padding) && mouseX<(width-2*padding) && mouseY>54 && mouseY<79 && mode==3) {
            let id_ = floor((mouseX-padding) / ((width-2*padding) / matchs.length));
            index = id_;
            annee = matchs[id_].annee;
        }
    }
}
function mouseMoved() {
    xM = max(padding,min(mouseX,width-2*padding));
    yM = max(padding,min(mouseY,height-2*padding));
}
function setDateSel(id_) {
    annee = annees[id_].a;
    index = annees[id_].m;
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
function createCategories() {
    let r = 18;
    let dx = (width - 2* padding) / 3;
    let x = r, y = 40;
    for (let p of selCat) {
        if ( (p.id & categories) == p.id ) {
            btCategories.push(new Switch(p.cat,x,y,dx-padding,r,[0,3],true));
        }
        x += dx;
    }
}
function createTournoi() {
    let r = 18;
    let y = height-r/2-padding;
    let x = 3*(width-padding)/4;
    let l = (width-4*padding)/4;
    return new Switch('Tournoi',x,y,l,r,[0,1]);
}
function createGraph() {
    let r = 18;
    let y = height-r/2-padding;
    let x = padding+r/2;
    let l = (width-padding-r)/4;
    return new Switch('Graphe',x,y,l,r,[0,3]);
}
function createInfo() {
    let l=18;
    let y =height - 15 - padding;
    let x = width / 2;
    return new BoutonC('⚙️',x,y,l,[0,1]);
}
// function drawBack() {
function createBack() {
    let r = 18;
    let y = height-2*r-padding;
    let x = (width-2*padding)/2;
    let l = (width-padding)/4;
    return new Bouton('Retour ⏎',x,y,l,[2,4],true);
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
    let y = 100;
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
        btCouleur[i].redim(x1+7,y,10);
        fill(color(couleur_arr[i].dm));rect(x1,y-8,16,16,2);
        y += dy;
    }
    y = 100;
    // for (let i in btPM) {
    //     btPM[i].redim(x1+20,y,10);
    //     y += dy;
    // }
}
function drawDate() {
    let dx = (width - 2* padding) / annees.length;
    let x = dx/2 + padding, y = 12;
    textAlign(CENTER,CENTER);
    textSize(14);
    for (let a of annees) {
        if (a.a==annee) {
            stroke(color(couleur.dm));
            fill(color(couleur.sel));
            rect(x-dx/2+1,y-12,dx-2,24,10);
            fill(color(couleur.bk));
            text(a.a,x,y);
        } else {
            noStroke();
            fill(color(couleur.bk));
            rect(x-dx/2+1,y-12,dx-2,24,10);
            fill(255);
            text(a.a,x,y);
        }
        x += dx;
    }
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
    let y = height-12*padding;
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
    btInfo.redom(width/2,y_,25,25);
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
        iDs.push(i);
    }
    for (let i in e_json) {
        let e = e_json[i];
        equipes.push( new Equipe(e.nom,joueurs[e.J1],joueurs[e.J2],e.annee));
    }
    nbMatchs = Object.keys(m_json).length ;
    calculELO(true);
    selA = annees.length-1;
    setDateSel(selA);

    // initJoueurs = joueurs.slice();
    poule = poules[0];
    btTournoi = createTournoi(); btTournoi.setOn(); // par defaut en mode tournois
    btGraphe = createGraph();
    btRetour = createBack();
    btInfo = createInfo();
    createCategories();
    btNotice = new Bouton('Notice ...',width/2,30,width/2,[4],false);
    btELO = new Bouton('ELO explication !',width/2,70,width/2,[4],false);
    btELO.setH(14); btNotice.setH(14);

    select("#notice").style('display','none');
    select("#ELO").style('display','none');

    update_color(0);
    for (let c=0;c<couleur_arr.length;c++) {
        btCouleur.push(new BoutonC('B',100,100,20,[4],true));
    }
    let dy = 20;
    for (let b=0;b<8;b++) {
        btPM.push(new BoutonC('🔼',width*2/3+60,100+(b*dy),5,[4],true));
        btPM.push(new BoutonC('🔽',width*2/3+75,100+(b*dy),5,[4],true));
        // dy += dy;
    }
}
function draw() {
    background(220);
    // idSel = joueurs[id].id;
    noStroke();
    btTournoi.show(mode); //drawSW();
    btGraphe.show(mode);
    btRetour.show(mode);
    btInfo.show(mode);
    btNotice.show(mode);
    btELO.show(mode);
    for (c of btCouleur) { c.show(mode); }
    for (c of btPM) { c.show(mode); }
    for (c of btCategories) { c.show(mode);}
    if (mode == 0 || mode==1 || mode==3)  { 
        drawDate();
    }
    if (mode == 3) {
        fill(color(couleur.bk));
        rect(padding,79,width-2*padding,height-145);
        for (let i in joueurs) {
            let idx = int(joueurs[i].hist[index].c);
            let elo = joueurs[i].hist[index].elo;
            joueurs[i].draw(idx,initJoueurs.length,width-2*padding,height-145,elo);
        }
    }
    // if (mode == 2) {drawBack(); }
    if (mode==0) {
        joueurs.sort( (a,b) => { return (b.hist[index].elo - a.hist[index].elo);});
        // iDs = [];
        // iDs = [ ...Array(joueurs.length).keys() ];
        let w_ = width-2*padding;
        let dx = w_/12;
        let x_ = padding + 2*8 +3.5*dx;
        let y_ = 67, dy_=18;
        noFill();
        stroke(color(couleur.bk));
        rect(x_+1,y_-dy_/2+1,dx-2,dy_-2);
        rect(x_+1*dx,y_-dy_/2+1,dx-2,dy_-2);
        rect(x_+2*dx,y_-dy_/2+1,dx-2,dy_-2);
        rect(x_+3*dx,y_-dy_/2+1,dx-2,dy_-2);
        rect(x_+4*dx,y_-dy_/2+1,dx-2,dy_-2);
        rect(x_+5*dx,y_-dy_/2+1,dx-2,dy_-2);
        textAlign(CENTER,CENTER);textStyle(NORMAL);
        fill(color(couleur.bk));
        text('ELO',x_+1+dx/2, y_);
        text('G',x_+dx+dx/2, y_);
        text('N',x_+2*dx+dx/2, y_);
        text('P',x_+3*dx+dx/2, y_);
        // textSize(10);
        text('po',x_+4*dx+dx/2, y_);
        text('co',x_+5*dx+dx/2, y_);
        for (let i in joueurs) {
            let idx = int(joueurs[i].hist[index].c);
            let elo = joueurs[i].hist[index].elo;
            // iDs[i] = idx;
            joueurs[i].show(idx, padding, 20*(i)+85, w_,elo);
        }
    }
    if (mode==2) {
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
