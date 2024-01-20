const eC = {version: 'v1.00', release:'r1', date:'jan/24', owner: 'rky', code:'y2I', annee:'2024', maj:'jan/24'};

// import * as su from './suduku.js';

let mobile;
let DEBUG = false, VERBOSE = false, LOOP = false, DENSITE = false;
let wEP,hEP;
const pEP = 50;
const RES = 100;
let message;

const cVert = [10,200,150];
const offset = 5;
let bgRate;

let startTime, endTime, courbe1;

let particules = [];
const NB_PARTICULES = 10;

function start() {
    startTime = new Date();
}
function end() {
    endTime = new Date();
    return (endTime-startTime);
}

function preload() { // voir getdata.js pour les preloads
}

function windowResized() {
    let wm = innerWidth * 1;
    let hm = innerHeight * 0.92;
    resizeCanvas(wm-0,hm-0);
    bgRate = new barGraph(width-60,height-40,45,12,0,100);
    wEP = width-2*offset;
    hEP = height - 2*offset - pEP;
    let x = offset+10, y= height-offset-20;
}

function setup() {
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    // get les data =
    canvas = createCanvas(10,10); // mise en place du ratio 0.59
    canvas.parent("#canvas");
    rate = select("#rate");
    windowResized();
    reset();
    // frameRate(10)
}

function mouseAdd() {
    addParticule(mouseX,mouseY,3);
}

function addParticule(x,y,type=1) {
    let p = new Particule(new Vector(x,y));
    p.setType(type);
    p.vel.random(-0.1,0.1);
    p.setEdge(offset,offset,wEP-offset,hEP-offset);
    particules.push(p);
}

function reset() {
    for (let i=0; i<NB_PARTICULES ; i++ ) {
        let p = new Particule(new Vector(wEP/2,hEP/2));
        p.pos.random(0,wEP);
        p.vel.random(-0.1,0.1);
        p.setEdge(offset,offset,wEP-offset,hEP-offset);
        particules.push(p);
    }
}

function draw() {
    background(0);
    rate.html(' Exécution en '+round(deltaTime)+' ms');
    fill(0); stroke(255);
    rect(offset,offset,wEP,hEP);
    //------

    for (let i=particules.length-1; i>=0 ; i--) {
        p = particules[i];
        if (p.run(particules)) {
            p.show();
        } else {
            particules.splice(i,1);
        }
    }

    addParticule(mouseX,mouseY);

    //----
    textAlign(CENTER,CENTER);
    textSize(10); fill(color(cVert));noStroke();
    text('eCoucou '+eC.version, width-40, height-10);

    // etat = (!DEBUG?'🌐':'')+(FLAT?'⎯':'')+(RAINBOW?'🌈':'')+(btDensite.value?'👨‍👩‍👦‍👦':'');
    // text('⏹️  ▶️',x,y);
    // text(searchInfo,7*width/8-55,3*height/4-7);

    bgRate.anim(deltaTime);
    // noLoop();
}