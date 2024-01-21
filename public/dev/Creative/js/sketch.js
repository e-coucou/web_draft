const eC = {version: 'v0.01', release:'r0', date:'jan/24', owner: 'rky', code:'y2I', annee:'2024', maj:'jan/24'};

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
const nbCase = 90;

let startTime, endTime, courbe1;

let  Palette = [], inc, nbCaseY;

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
    vx=select("#vx"); vx.html('⌖ '+eC.version+' '+eC.release+' >'+eC.maj+'<');
    cr=select("#cr"); cr.html('(ツ) © eCoucou '+eC.annee);
    windowResized();
    reset();
    // frameRate(10)
}

function reset() {
    inc = (wEP-2) / nbCase;
    nbCaseY = int(hEP / inc);
    Palette = [
        color(0),
        color(255,0,0),
        color(0,255,0),
        color(0,0,255),
        color(255,255,0),
        color(255,0,255),
        color(0,255,255),
        color(255)];
    randomSeed(10);
}

function draw() {
    background(0);
    rate.html(' Exécution en '+round(deltaTime)+' ms');
    fill(0); stroke(255);
    rect(offset,offset,wEP,hEP);
    //------

    noStroke();
    rectMode(CORNER);
    ellipseMode(CENTER);
    for (let i=0 ; i<nbCaseY ; i++) {
        let y = i*inc+offset;
        for (let j=0; j<nbCase ; j++) {
            let c = random(Palette);
            fill(c);
            let x = j*inc + offset+1;
            rect(x,y,inc);
        }
    }

    noFill();
    for (let i=0 ; i<nbCaseY ; i++) {
        let y = i*inc+offset;
        for (let j=0; j<nbCase ; j++) {
            let c = random(Palette);
            // fill(c);noStr
            stroke(c); strokeWeight(inc/2);strokeCap(SQUARE);
            let x = j*inc + offset + 1;
            // circle(x,y,inc);
            let offAngle = int(random(4));
            push();
            translate(x+inc/2, y+inc/2);
            rotate(offAngle*PI/2);
            arc(-inc/2,-inc/2, 2*inc - inc/2 , 2*inc-inc/2 ,0,PI/2);
            pop();
        }
    }

    //----
    textAlign(CENTER,CENTER);
    textSize(10); fill(color(cVert));noStroke();
    text('eCoucou '+eC.version, width-40, height-10);

    // etat = (!DEBUG?'🌐':'')+(FLAT?'⎯':'')+(RAINBOW?'🌈':'')+(btDensite.value?'👨‍👩‍👦‍👦':'');
    // text('⏹️  ▶️',x,y);
    // text(searchInfo,7*width/8-55,3*height/4-7);

    bgRate.anim(deltaTime);
    noLoop();
}