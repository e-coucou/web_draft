const eC = {version: 'v0.01', release:'r0', date:'oct/23', owner: 'rky', code:'y2H', annee:'2023', maj:'oct/23'};
let mobile;
let DEBUG = true;
let dimension = 101;
let moveG = [], moveD=[];
let RS, reset;

let grille = [];
let fourmis= {};
let iter=0;
let MAX_ITER = 1000;

function windowResized() {
    let m = min(innerHeight,innerWidth);
    let w_ = int(m*0.8) - 10;
    resizeCanvas(w_,w_);
}

function Id(i,j, dim) {
    return (i + j * dim);
}

function fromId(id,dim) {
    return [int(id%dim),int(id/dim)]
}

function initGrille(taille) {
    for (let j=0; j<taille; j++) {
        for (let i=0; i<taille; i++) {
            let id = Id(i,j,taille);
            grille[id] = 0;
        }
    }
}

function drawGrille(taille) {
    let inc = int(width/taille);
    let offset = (width - inc * taille ) / 2;
    stroke(120); strokeWeight(1);
    for (let j=0; j<taille; j++) {
        for (let i=0; i<taille; i++) {
            let id = Id(i,j,taille);
            if (grille[id] == 0) {
                fill(255);
            } else { fill(0);}
            let x = i*inc + offset;
            let y = j*inc + offset;
            square(x,y,inc);
        }
    }
}

function drawFourmis(taille) {
    let inc = int(width/taille);
    let offset = (width - inc * taille ) / 2;
    fill(255,0,0);
    noStroke();
    let x = (fourmis.c+0.5)*inc + offset;
    let y = (fourmis.l+0.5)*inc + offset;
    circle(x,y,inc/2);
}
function moveFourmis(taille) {
    let id = fourmis.id;
    switch (grille[id]) {
        case 0: {// move droite
            grille[id] = 1;
            fourmis.id += moveD[fourmis.dir];
            fourmis.dir = (fourmis.dir+1)%4;
            let [c,l] = fromId(fourmis.id,dimension);
            fourmis.c = c;
            fourmis.l = l;
            break;}
        case 1: {// move gauche
            grille[id] = 0;
            fourmis.id += moveG[fourmis.dir];
            fourmis.dir = ( fourmis.dir==0?3:(fourmis.dir-1) )%4;
            let [c,l] = fromId(fourmis.id,dimension);
            fourmis.c = c;
            fourmis.l = l;
            break;}
    }
}
function keyPressed() {
    if (key=='s') {
        b_canon =  !b_canon;
    }
    if (key=='l') {
        loop();
    }
    if (key=='d') {
        DEBUG = ! DEBUG;
    }
}
function Init() {
    initGrille(dimension);
    fourmis = {l:int(dimension/2), c:int(dimension/2), dir :0 , id:0};
    id = Id(fourmis.c, fourmis.l, dimension);
    fourmis.id = id;
    moveG = [- 1, -dimension, +1,+dimension];
    moveD = [+1, +dimension, -1, -dimension];
    DEBUG = true;
    loop();
}
function RunStop() {
    DEBUG = !DEBUG;
    if (!DEBUG) loop();
}

function setup() {
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    canvas = createCanvas(10,10); // mise en place du ratio 0.59
    canvas.parent("#canvas");
    windowResized();
    rate = select("#rate");
    RS = select("#RS");
    RS.mousePressed(RunStop);
    reset = select("#reset");
    reset.mousePressed(Init);
    Init();
}

function draw() {
    background(0);
    drawGrille(dimension);
    drawFourmis(dimension);
    for (let i=0;i<100;i++) {
        moveFourmis(dimension);
        iter++;
    }
    rate.html('execution en '+round(deltaTime)+' ms'+'    Nombre de particules = '+iter);
    if (DEBUG) noLoop();
}