const eC = {version: 'v1.1', release:'r2', date:'mar/24', owner: 'rky', code:'y2I', annee:'2024', maj:'mar/24'};
let mobile;
let DEBUG = false, VERBOSE = false, LOOP = false, DENSITE = false;

let startTime, endTime;

const N=3;
let carre;
let btReplay, btReset, btSolve;

function start() {
    startTime = new Date();
}
function end() {
    endTime = new Date();
    return (endTime-startTime);
}

function preload() {
    // voir getdata.js pour les preloads
    // dataJson = loadJSON('./data/dataEP.json');
    // img = loadImage('./img/joconde.jpg');
}

function windowResized() {
    let m = min(innerHeight,innerWidth) * 0.92;
    resizeCanvas(m,m);
    btReplay.position(innerWidth/2-width*0.1,height*0.92);
    btReplay.style('width', width*0.2);
    btReplay.style('height', height*0.05);
    btReset.position(innerWidth/2-width*0.35,height*0.92);
    btReset.style('width', width*0.2);
    btReset.style('height', height*0.05);
    btSolve.position(innerWidth/2+width*0.15,height*0.92);
    btSolve.style('width', width*0.2);
    btSolve.style('height', height*0.05);

    carre = new Merlin(N,width*0.9,0.05*width);

}

function fctReplay() {
    carre.rePlay();
}
function fctReset() {
    carre.init();
}
function fctSolve() {
    carre.solve();
}

function setup() {
    console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    // get les data =
    canvas = createCanvas(1,1); // mise en place du ratio 0.59
    canvas.parent("#canvas");
    rate = select("#rate");
    vx=select("#vx"); vx.html('⌖ '+eC.version+' '+eC.release+' >'+eC.maj+'<');
    cr=select("#cr"); cr.html('(ツ) © eCoucou '+eC.annee);

    btReplay = createButton("Replay");
    btReplay.mousePressed(fctReplay);
    btReplay.parent("#canvas");
    btReplay.class("styled_2");
    btReset = createButton("Reset");
    btReset.mousePressed(fctReset);
    btReset.class("styled_2");
    btReset.parent("#canvas");
    btSolve = createButton("Solution");
    btSolve.mousePressed(fctSolve);
    btSolve.class("styled_2");
    btSolve.parent("#canvas");

    windowResized();

}

function mouse_(x,y) {
    // nextP(x,y);
    carre.play(x,y);
}

function touchStarted() {
    mouseSelection=true;
    let fs =fullscreen();
    // console.log(fs);
    // if (!fs) { fullscreen(true);}
    mouse_(touches[0].x, touches[0].y);
}

// function mousePressed() {
//     mouse_();
// }
function mouseClicked() {
    mouse_(mouseX,mouseY);
}

function draw() {
    background("#3700B3");
    rate.html(' Exécution en '+round(deltaTime)+' ms');
    //---
    // Main

    carre.show();

    //---
    textAlign(CENTER,CENTER);
    textSize(10); fill("#f0e7fa");noStroke();
    text('eCoucou '+eC.version, width-40, height-10);

// noLoop();
}