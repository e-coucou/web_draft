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
let mode = 1, debug = 0;
let annee, selA, phase = "Finale", poule, categories = 7;
let padding = 5;
let toggle=true;
let btTournoi,btGraphe,btRetour, btCategories=[], btInfo, btELO, btNotice;
let debounce=0;
let img_gassin, img_ramatuelle, img_saint_tropez;
let img_finale=[];
let btHTML;

let couleur = {bk:[10,50,20], bg:[30,70,30], sel:[50,200,50], pl:[20,80,20], dm:[50,120,50] ,
    titre:[5,67,46], f:[60,140,70], cur:[220,250,50]};
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
    console.log('ici')
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
        // selection switch Tournoi/Liste
        if (btTournoi.isIn(mouseX,mouseY,mode)) { btTournoi.setSW(BtTournoi); }
        // selection Bouton de retour
        if (btRetour.isIn(mouseX,mouseY,mode)) { 
            // select('#notice').style('display','hidden');
            // select('#ELO').style('display','hidden');
                    mode=0; toggle=true; btTournoi.setOff();}
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
                mode = 2;
            }
        }
        if (btGraphe.isIn(mouseX,mouseY,mode)) {
            btGraphe.setSW(BtGraphe);
        }    
        if (btInfo.isIn(mouseX,mouseY,mode)) {
            mode = 4;
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
    if (key=='h') { select('canvas').hide();}
    if (key=='s') { console.log('show');select('canvas').show();}
    if (key=='a') { 
        my = select("#notice");
        my.style('display','none');
        my = select("#ELO");
        my.style('display','none');
    }
    if (key=='z') { 
        my = select("#notice");
        my.style('display','none');
        my = select("#ELO");
        my.style('display','none');
    }
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
}
function drawDate() {
    let dx = (width - 2* padding) / annees.length;
    let x = dx/2 + padding, y = 12;
    textAlign(CENTER,CENTER);
    textSize(14);
    for (let a of annees) {
        if (a.a==annee) {
            stroke(color(couleur.dm));
            fill(color(couleur.cur));
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
    let dx = (width-2*padding) / matchs.length , dy=10;
    for (let i=0; i<matchs.length; i++) {
        if (i==index) {
            fill(color(couleur.cur));
        } else {
            if (matchs[i].type=="Poule") fill(color(couleur.pl));
            if (matchs[i].type=="Demi") fill(color(couleur.dm));
            if (matchs[i].type.indexOf("Finale") != -1) fill(color(couleur.f));
        }
        rect(x+i*dx,y,dx,dy);
    }
}
function showMatch() {
    let x = padding;
    let y = height-7*padding;
    let m = matchs[index];
    let e1 = m.equipes[0].eq;
    let e2 = m.equipes[1].eq;
    let mid = 5*(width-2*padding)/8, dt = 20;
    let s2 = (width*3/4) * 0.07 +1;
    let w2 = (width*3/4)/2 - s2 -padding;
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
    let a_ = false;
    for (let i in m_json) {
        let m = m_json[i];
        matchs.push( new Match(i,equipes[m.E1],equipes[m.E2],m.Sc1,m.Sc2,m.type, m.annee, m.poule,m.k));
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

    initJoueurs = joueurs.slice();
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
    for (c of btCategories) {
        c.show(mode);
    }
    if (mode == 0 || mode==1 || mode==3)  { 
        drawDate();
    }
    if (mode == 3) {
        fill(color(couleur.bk));
        rect(padding,79,width-2*padding,height-120);
        for (let i in joueurs) {
            let idx = int(joueurs[i].hist[index].c);
            let elo = joueurs[i].hist[index].elo;
            joueurs[i].draw(idx,initJoueurs.length,width-2*padding,height-120,elo);
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
}
