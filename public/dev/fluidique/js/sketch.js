const eC = {version: 'v0.01', release:'r0', date:'oct/23', owner: 'rky', code:'y2H', annee:'2023', maj:'oct/23'};
let mobile;
let particules=[];
let nbParticules=70;
let size = 2;

function windowResized() {
    let m = min(innerHeight,innerWidth);
    let w_ = int(m*0.4);
    resizeCanvas(w_,w_);
}

function start() {
    let parLigne = int(sqrt(nbParticules));
    let parCol = (nbParticules-1)/parLigne + 1;
    let espace = size * 2 + 5;
    for (let i=0; i<nbParticules ; i++ ) {
        let x = int((i % parLigne + int(parLigne /2+0.5)  ) * espace);
        let y = int((i / parLigne + int(parCol/2+0.5)  ) * espace);
        particules.push( new Particule(x,y,color(0,120,120)));
    }
}

function alea() {
    for (let i=0; i<nbParticules; i++) {
        let x = (random(-1,1));
        let y = (random(-1,1));
        particules.push(new Particule(x,y,color(0,0,0)));
    }
}
function setup() {
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    canvas = createCanvas(10,10); // mise en place du ratio 0.59
    canvas.parent("#canvas");
    windowResized();
    mouseP = createVector(0, 0);
    // for (let i=0;i<1;i++) {
    //     particules.push(new Particule(width/2,height/2,color(0,120,120)))
    // }
    // frameRate(1);
    alea();
    for (let p of particules) {
        p.densite();
    }
}

function draw() {
    background(255);
    drawDensite();
    // drawVecteur();
    for (let p of particules) {
        p.show();
    }
    showBlur();
    grilleRecherche();
    // noLoop();
}