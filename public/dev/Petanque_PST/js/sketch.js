let joueurs = [];
let equipes = [];
let matchs = [];
let j_json, e_json, m_json;
let index = 0;
let nbMatchs;

function mousePressed() {
}

function preload() {
    j_json = loadJSON("./data/joueurs.json");
    e_json = loadJSON("./data/equipes.json");
    m_json = loadJSON("./data/matchs.json");
}

function setup() {
    canvas = createCanvas(700,600);
    canvas.parent("#canvas");

    for (let i in j_json) {
        let j = j_json[i];
        joueurs.push( new Joueur(j.nom,j.id));
    }
    for (let i in e_json) {
        let e = e_json[i];
        equipes.push( new Equipe(e.nom,joueurs[e.J1],joueurs[e.J2]));
    }
    nbMatchs = Object.keys(m_json).length ;
    // for (let i in m_json) {
    //     let m = m_json[i];
    //     matchs.push( new Match(i,equipes[m.E1],equipes[m.E2],m.Sc1,m.Sc2));
    // }
    frameRate(5);
}


function draw() {
    background(200);
    let m = m_json[index];
    matchs.push( new Match(index,equipes[m.E1],equipes[m.E2],m.Sc1,m.Sc2,m.type, m.annee));
    let classement = joueurs.sort( (a,b) => { if (a.ELO > b.ELO) return -1});
    fill(255);
    textAlign(LEFT,CENTER);
    textSize(12);
    for (let i in classement) {
        text(classement[i].nom+" "+nf(classement[i].ELO,0,0), width-120, 20*i+80);
    }
    fill(0);
    textAlign(CENTER,CENTER);
    textSize(36);
    text(matchs[index].annee, width-80, 25);
    textSize(14);
    text(matchs[index].type, width-80, 60);
    index += 1;
    if (index>=nbMatchs) noLoop();
}