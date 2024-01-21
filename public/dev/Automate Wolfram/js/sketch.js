const eC = {version: 'v1.30', release:'r0', date:'jan/24', owner: 'rky', code:'y2I', annee:'2024', maj:'jan/24'};

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
let grille = [];
let inc;
let rule = 30, ruleIn;
const nbCase = 151;

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
    ruleIn.position(windowWidth-20-ruleIn.elt.offsetWidth,1);
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
    inputRule();
    windowResized();
    reset();
    // frameRate(10)
}

function reset() {
    inc = (wEP-2) / nbCase;
    grille = [];
    ligne = [];
    for (let i = 0; i<nbCase ; i++) {
        // ligne.push(round(random(0,1)));
        ligne.push(0);
    }
    grille.push(ligne);
    ligne[int(nbCase/2)]=1;
}

function inputRule() {
    ruleIn = createElement('textarea','30');
    ruleIn.input(changeRule);
    ruleIn.parent('selection');
    ruleIn.class('styled_Couleur');
    rule = int(ruleIn.value());
}

function changeRule() {
    let r = int(ruleIn.value());
    if (!r) {r=0;};
    r= r%256;
    newRule(r);
}

function newLigne() {
    let nLigne = [];
    let ligne = grille[grille.length-1];
    // if (grille.length>1) {
    //     let pLigne = grille[grille.length-2];
    //     nLigne[0] = pLigne[1];
    // } else nLigne[0]=0;
    for (let i=0; i<ligne.length ; i++) {
        let v = ligne[(i-1+nbCase)%nbCase]*4 + 2*ligne[i] + ligne[(i+1)%nbCase];
        let b = (rule & Math.pow(2,v)) ? 1 : 0;
        nLigne.push(b);
    }
    // nLigne.push(ligne[ligne.length-1]);
    // nLigne.push(0);
    grille.push(nLigne);
}

function newRule(x) {
    rule = x;
    ruleIn.value(x);
    reset();
}

function nextRule() {
    newRule((rule+1)%256);
}

function draw() {
    background(0);
    rate.html(' Exécution en '+round(deltaTime)+' ms');
    fill(0); stroke(255);
    rect(offset,offset,wEP,hEP);
    //------
    let offX = (wEP - nbCase*inc)/2 +1;
    fill(255); stroke(120);
    for (let j=0; j<grille.length; j++) {
        let ligne = grille[j]
            let y = j*inc + offset+1;
        for (let i = 0; i<nbCase ; i++) {
            let x = i*inc + offset+offX;
            // stroke(120); noFill();
            if (ligne[i]==1) {
                rect(x,y,inc,inc);
            }
        }
    }
    if (grille.length < int(wEP/inc/2+1)  && hEP > (grille.length*inc)) { 
        newLigne();
    }
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