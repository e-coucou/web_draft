const eC = {version: 'v2.1', release:'r0', date:'sep/23', owner: 'rky', code:'y2H', annee:'2023'};
let param, run=false,enCours=2024;
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
let mode = 1, debug = 0, mode_prev, filtreJ=false;
let annee, selA, phase = "Finale", poule, categories = 7;
let padding = 5;
let toggle=true;
let btTournoi,btGraphe,btRetour, btCategories=[], btInfo, btELO, btNotice, btListe, btZoom;
let debounce=0;
let img_gassin, img_ramatuelle, img_saint_tropez;
let img_finale=[];
let btHTML;
let couleur_sel=0, couleur , btCouleur=[], btAnnee=[], btPhase=[], btPoule=[];
let btPM = [], btNav = [], btFiltre;
let mouseSelection=false;
let couleur_arr =[
    {bk:'#000000', dm:'#cccccc', cur:'#444444', sel:'#ff3333', txt:'#ffffff'},
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
    update();
}
function update_Nav(n) {
    switch (mode) {
        case 2:
            switch(int(n)) {
                case 0 : id=max(0,id - 1) ; break;
                case 1 : id=(id+1) % joueurs.length;break;
            // case 1 : mode = 0 ; console.log('retour') ;break;
            }
            break;
        case 3:
        case 0:
            if (run) { btNav[1].txt = '▶️' ; run=false;} 
                else { btNav[1].txt = '⏸️' ; run= true; }
            break;
        case 4 : mode = 5; break;
        case 5 : mode = 4; break;
    }
}
function updateMatch(id_) {
    index = id_;
    annee = matchs[index].annee;
    for (let i in annees) {
        c = btAnnee[i];
        if (annees[i].a == annee) { c.setOn();} else { c.setOff();}
    }
}
function setCat(id_=1) {
    categories = categories ^ id_;
    id = 0;
    update();
}
function BtTournoi() {
    joueurs = initJoueurs.slice();
    mode= 1;
    id=0;
    update();
}
function BtGraphe() {
    // mode = mode ^ 3;
    mode = 3;
    update();
}
function HTMLRetour() {
    select('canvas').show();
    select('#notice').style('display','none');
    select('#ELO').style('display','none');
    select('#start').style('display','none');
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
        select('#start').style('display','none');
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
        select('#start').style('display','none');
        toggle = false;
    }
}

// function touchStarted() {
//     let fs =fullscreen();
//     if (!fs) { fullscreen(true);}
// }

function windowResized() {
    let h_ = innerHeight*0.98;
    let w_ = min(0.59*h_, innerWidth);
    resizeCanvas(w_,h_);
    let x_ = (windowWidth - width) / 2;
    let y_ = (windowHeight - height) / 2;
    select('canvas').position(x_, y_+10);
    // canvas.position(x_, y_+10);
    redimButtons();
    mouseSelection=true;
}

function setup() {
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    let h_ = innerHeight*0.98;
    let w_ = min(0.59*h_, innerWidth);
    canvas = createCanvas(w_,h_); // mise en place du ratio 0.59
    canvas.parent("#canvas");
    let x = (windowWidth - width) / 2;
    let y = (windowHeight - height) / 2;
    canvas.position(x, y+10);
  
    for (let i in j_json) {
        let j = j_json[i];
        initJoueurs.push( new Joueur(j.nom,j.id));
    }
    for (let i in e_json) {
        let e = e_json[i];
        equipes.push( new Equipe(e.nom,initJoueurs[e.J1],initJoueurs[e.J2],e.annee));
    }
    nbMatchs = Object.keys(m_json).length ;
    calculELO(true);
    poule = poules[0];
    createButtons();
    setDateSel(annees.length-1);
    select("#notice").style('display','none');
    select("#ELO").style('display','none');
    select('#start').style('display','none');
    update_color(0);
    windowResized();
    // mouseSelection=true;
}
function draw() {
    if (run) {
        if (frameCount % 30 == 0) {
            index = (index+1) % matchs.length;
            updateMatch(index);
            mouseSelection = true;
        }
    }
    if (mouseSelection) {
        background(220);
        noStroke();
        switch (mode) {
            case 3: // mode Graphe
                btGraphe.setOn();
                drawGraphe();
                break;
            case 0:
                btListe.setOn();
                drawListe();
                break;
            case 2:
                run=false; btNav[1].txt = '▶️' ; run=false;
                btZoom.setOn();
                if (joueurs[id].id != 0) {
                    joueurs[id].fiche(padding,15,width-2*padding,matchs);
                } else {
                    x=padding; y=15 ; s=10 ;w_=width-2*padding;
                    rect(x+s,y-13,w_-s,26);
                    fill(255); textAlign(LEFT,CENTER); textSize(16);
                    text('_____ / Joueur Neutre',x+2*s,y);
                }
                break;
            case 4:
            case 5:
                run=false; btNav[1].txt = '▶️' ; run=false;
                btInfo.setOn();
                drawParam(); break;
            case 1:
                run=false; btNav[1].txt = '▶️' ; run=false;
                btTournoi.setOn();
                drawTournois(0,40,width, height-100,annee); break;
        }
        showButtons();
        textAlign(LEFT,CENTER); fill(0); textSize(8); textStyle(NORMAL);
        text(mode,10,height-10);
        text('eCoucou '+eC.version+' ['+eC.annee+']',width*4/5,height-8);
        for (let i=0; i<touchStarted.length;i++) {
            text(touches[0].x+'/'+touches[0].y,20,height-50);
        }
    }
    mouseSelection=false;
}


document.ontouchmove = function(event) {event.preventDefault();};