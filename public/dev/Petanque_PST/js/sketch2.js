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
let toggle=false;

let couleur = {bk:[10,50,20], bg:[30,70,30], sel:[50,200,50], pl:[20,80,20], dm:[50,120,50] ,
    titre:[5,67,46], f:[60,140,70], cur:[180,180,0]};
let poules = ['Gassin', 'Ramatuelle'];
let selCat = [ {id:1 , cat:'Tireur'},{id:2, cat:'Pointeur'},{id:4, cat:'Indifférent'}];

function setCat(id_=1) {
    categories = categories ^ id_;
    id = 0;
}
function mouseReleased() {
    toggle = false;
}
function mousePressed() {
    // Mode 0 = Liste
    // Mode 1 = Tournoi
    // Mode 2 = Fiche
    // Mode 3 = GrapheX
    //
    if ( !toggle) {
        if (mode==0 || mode==3) {
            // Selction de la categorie du joueur /Tireur/Pointeur/Indifférent
            if (mouseX>padding && mouseX<(width-padding) && mouseY<52 && mouseY>26) {
                let id_ = floor((mouseX-padding) / ((width+2*padding) / 3));
                setCat(selCat[id_].id);
            }
        }
        // selction switch Tournoi/Liste
        if (mode==0 || mode==1) {
            // Selction de la categorie du joueur
            if (mouseX>(3*(width-padding)/4) && mouseX<(width-2*padding) && mouseY<(height-padding) && mouseY>(height-20-padding)) {
                joueurs = initJoueurs.slice();
                mode = (mode + 1) %2;
                id=0;
                return;
            }
        }
        // Selection de l'année
        if (mode==0 || mode==1 || mode == 3 || mode==2 ) {
            if (mouseX>padding && mouseX<(width-padding) && mouseY<24 && mouseY>0) {
                let id_ = floor((mouseX-padding) / ((width+2*padding) / annees.length));
                if (mode < 2 || mode==3) {
                    selA = id_;
                    setDateSel(selA);
                } else {
                    if (id_==0) mode = 0;
                }
            }
        }
        // selection d'un jouer dans la liste
        if (mouseX>(padding) && mouseX<(width-padding) && mode==0) {
            let id_ = round((mouseY - 80) / 20);
            if ( id_<0 || id_>=joueurs.length) {
                mode=0;
            } else {
                id = id_;
                mode = 2;
            }
        }
        if (mode==0 || mode==3) {
            // Selction de la categorie du joueur
            if (mouseX>(2*padding) && mouseX<(width-2*padding)/4 && mouseY<(height-padding) && mouseY>(height-20-padding)) {
                // joueurs = initJoueurs.slice();
                console.log('ici');
                mode = mode ^ 3;
            }
        }    
        if (mode==1) {
            // Selction de la phase
            if (mouseX>padding && mouseX<(width-padding) && mouseY<52 && mouseY>26) {
                let id_ = floor((mouseX-padding) / ((width+2*padding) / 3));
                phase = t_json[id_].type;
                poule = poules[0];
            }
            // Selction de la poule
            if (mouseX>padding && mouseX<(width-padding) && mouseY<79 && mouseY>54) {
                let id_ = floor((mouseX-padding) / ((width+2*padding) / 2));
                poule = poules[id_];
            }
        }
        // Selection du joueur (cote en Y modulo le nb de joueurs)
        if (mouseX>(padding) && mouseX<(width-2*padding) && mouseY>(padding) && mouseY<(height-padding) && mode==0) {
            let id_ = floor((mouseY-padding) / ((height-padding) / joueurs.length));
            id=iDs[id_];
        }
        // Selection du match par la bande inférieure
        if (mouseX>(padding) && mouseX<(width-2*padding) && mouseY>(height-padding) && mouseY<(height- padding+10) && mode==0) {
            console;log('ici');
            let id_ = floor((mouseX-padding) / ((width-2*padding) / matchs.length));
            index = id_;
            annee = matchs[id_].annee;
        }
    }
    toggle = true;
}
function mouseMoved() {
    xM = max(padding,min(mouseX,width-2*padding));
    yM = max(padding,min(mouseY,height-2*padding));
    // if (mouseX>(padding) && mouseX<(width-2*padding) && mouseY>(h+padding) && mouseY<(h+padding+10) && mode==0) {
    //     let id_ = floor((mouseX-padding) / (w / matchs.length));
    //     index = id_;
    //     annee = matchs[id_].annee;
    // }
    // if (mouseX>(padding) && mouseX<(w+padding) && mouseY>(padding) && mouseY<(h+padding) && mode==0) {
    //     let id_ = floor((mouseY-padding) / (h / joueurs.length));
    //     console.log(id_);
    //     id=id_;
    // } 
}
function selCategories() {
    let dx = (width - 2* padding) / 3 ;
    let x = dx/2 + padding, y = 40;
    textAlign(CENTER,CENTER);
    for (let p of selCat) {
        if ( (p.id & categories) == p.id ) {
            fill(color(couleur.cur));
        } else {
            fill(color(couleur.bk));
        }
        rect(x-dx/2+1,y-12,dx-2,24);
        fill(255);
        text(p.cat,x,y);
        x += dx;
    }
}

function setDateSel(id_) {
    annee = annees[id_].a;
    index = annees[id_].m;
}
function keyPressed() {
    if (key=='w') { BSwitch();}
    if (key=='d') { debug = (debug+1)%2;}
}
function preload() {
    j_json = loadJSON("./data/joueurs.json");
    e_json = loadJSON("./data/equipes.json");
    m_json = loadJSON("./data/matchs.json");
    t_json = loadJSON("./data/type.json");
}
function drawSW() {
    let y = height-20;
    let x = 3*(width-padding)/4;
    let l = (width-2*padding)/4;
    textAlign(CENTER,CENTER);
    fill(color(couleur.bg));
    rect(x,y-10,l-20,20);
    circle(x,y,20);
    circle(x+l-20,y,20);
    fill(255);
    textAlign(LEFT,CENTER);
    if (mode==0) {
        text('Tournoi',6*(width-padding)/8,y);
        fill(color(couleur.bk));
        circle(x+l-l/2,y,18);
    } else {
        text('Tournoi',6*(width-padding)/8,y);
        fill(color(couleur.cur));
        circle(x+l-l/4,y,18);
    }
}
function drawGraph() {
    let y = height-20;
    let x = 2*padding;
    let l = (width-2*padding)/4;
    textAlign(CENTER,CENTER);
    fill(color(couleur.bg));
    rect(x,y-10,l-20,20);
    circle(x,y,20);
    circle(x+l-20,y,20);
    fill(255);
    textAlign(LEFT,CENTER);
    if (mode==0) {
        text('Graphe',3*padding,y);
        fill(color(couleur.bk));
        circle(x+l-l/2,y,18);
    } else {
        text('GrapheX',3*padding,y);
        fill(color(couleur.cur));
        circle(x+l-l/4,y,18);
    }
}function drawBack() {
    let y = 12;
    textAlign(CENTER,CENTER);
    fill(color(couleur.cur));
    rect(2,y-12,width/4,24);
    fill(255);
    text('Retour ',width/8,y);
}
function drawDate() {
    let dx = (width - 2* padding) / annees.length;
    let x = dx/2 + padding, y = 12;
    textAlign(CENTER,CENTER);
    for (let a of annees) {
        if (a.a==annee) {
            fill(color(couleur.cur));
        } else {
            fill(color(couleur.bk));
        }
        rect(x-dx/2+1,y-12,dx-2,24);
        fill(255);
        text(a.a,x,y);
        x += dx;
    }
}
function windowResized() {
    canvas = resizeCanvas(innerWidth*0.99,innerHeight*0.8);
}

function setup() {
    canvas = createCanvas(innerWidth*0.99,innerHeight*0.8);
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

    initJoueurs = joueurs.slice();
    poule = poules[0];
}

// function BSwitch() {
//     joueurs = initJoueurs.slice();
//     mode = (mode + 1) %2;
//     id=1;
// }
function draw() {
    background(220);
    console.log(id);
    idSel = joueurs[id].id;
    noStroke();
    if (mode < 2)  { drawDate(); drawSW(); }
    if (mode == 3) {
        drawDate(); 
        fill(color(couleur.bk));
        rect(padding,79,width-2*padding,height-120);
        for (let i in joueurs) {
            let idx = int(joueurs[i].hist[index].c);
            let elo = joueurs[i].hist[index].elo;
            joueurs[i].draw(idx,initJoueurs.length,width-2*padding,height-120,elo);
        }
    }
    if (mode == 2) {drawBack(); }
    if (mode == 0 || mode == 3) {
        selCategories();
        drawGraph();
        switch(categories) {
            case 0:
            case 7 : joueurs = initJoueurs.slice(); break;
            case 1 : joueurs = initJoueurs.filter( a => { return a.tireur > a.pointeur;}); break;
            case 2 : joueurs = initJoueurs.filter( a => { return a.tireur < a.pointeur;}); break;
            case 3 : joueurs = initJoueurs.filter( a => { return a.tireur != a.pointeur;}); break;
            case 4 : joueurs = initJoueurs.filter( a => { return a.tireur == a.pointeur;}); break;
            case 5 : joueurs = initJoueurs.filter( a => { return a.tireur >= a.pointeur;}); break;
            case 6 : joueurs = initJoueurs.filter( a => { return a.tireur <= a.pointeur;}); break;
        }
    }
    if (mode==0) {
        joueurs.sort( (a,b) => { return (b.hist[index].elo - a.hist[index].elo);});
        iDs = [];
        iDs = [ ...Array(joueurs.length).keys() ];
        for (let i in joueurs) {
            let idx = int(joueurs[i].hist[index].c);
            let elo = joueurs[i].hist[index].elo;
            iDs[i] = idx;
            joueurs[i].show(idx, padding, 20*(i)+80, width-2*padding,elo);
            // if (mode==0) {
            //     joueurs[i].draw(idx,joueurs.length,w,h,elo);
            // }
        }
    }
    if (mode==2) {
        joueurs[id].fiche(padding,40,width-2*padding,matchs);
    }
    if (mode==1) drawTournois(0,40,width, height-100,annee);
    // if (mode==0) {
    //     drawDateBar();
    //     showMatch(index);
    // }
    // // if (frameCount % 5 == 0) {
    //     if (index<nbMatchs-1) {
    //         index += 1;
    //     }
    // }
    // if (id != -1) {
    //     joueurs[id].fiche(padding,height/2,w,matchs);
    // }
    // stroke(130);
    // line(padding,yM,w+padding,yM);
    // line(xM,padding,xM,h+padding);
}
