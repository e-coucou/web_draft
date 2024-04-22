const eC = {version: 'v0.1', release:'r0', date:'apr/24', owner: 'rky', code:'y2I', annee:'2024', maj:'apr/24'};
let mobile;
let DEBUG = false, VERBOSE = false, LOOP = false, DENSITE = false;

let startTime, endTime;


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
    // PI_ = loadStrings('../../../data/pi')
    // PI_ = loadStrings('../../data/pi_million.txt');
}

function windowResized() {
    let m = min(innerHeight,innerWidth) * 0.92;
    resizeCanvas(m,m);
    // btReplay.position(innerWidth/2-width*0.1,height*0.92);
    // btReplay.style('width', width*0.2);
    // btReplay.style('height', height*0.05);
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

    // btReplay = createButton("↩️ Replay");
    // btReplay.mousePressed(fctReplay);
    // btReplay.parent("#canvas");
    // btReplay.class("styled_2");
    windowResized();

}


function mouse_(x,y) {
}

function touchStarted() {
    mouseSelection=true;
    let fs =fullscreen();
    // if (!fs) { fullscreen(true);}
    if (mobile) {
        mouse_(touches[0].x, touches[0].y);
    }
}

function mouseClicked() {
    mouse_(mouseX,mouseY);
}

function gcd(a,b) {
    if (a<b) {
        [a,b] = [b,a];
    }
    let r = a % b;
    if (r==0) { 
        return b;
    } else {
        return gcd(b,r);
    }
}

function PowMod(e,b,m) { //exposant, base, modulo
    let ret =1;
    do {
        if (e & 1 >0) {
            ret = (ret*b) % m;
        }
        e >>= 1;
        b = (b*b)%m;
    } while (e != 0);
    return ret;
}

function Fermat(p) {
    if (PowMod(p-1,2,p) == 1) {
        return true;
    } else { return false; }
}  

function draw() {
    background("#f0e7fa");
    rate.html(' Exécution en '+round(deltaTime)+' ms');
    //---
    // Main

    textAlign(LEFT,CENTER);
    textSize(24);
    noStroke();
    fill('#3700B3');
    text("Test de Primalité de Fermat",50,120);



    //---
    textAlign(CENTER,CENTER);
    textSize(10); fill("#f0e7fa");noStroke();
    text('eCoucou '+eC.version, width-40, height-10);

// noLoop();
}