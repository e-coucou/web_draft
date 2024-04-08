const eC = {version: 'v1.0', release:'r1', date:'apr/24', owner: 'rky', code:'y2I', annee:'2024', maj:'apr/24'};
let mobile;
let DEBUG = false, VERBOSE = false, LOOP = false, DENSITE = false;

let startTime, endTime;

let coPrime;
let cntCoPrime=0, cntTotal=0;

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

function calc(n) {
    for (let i=0;i<n;i++) {
        let a = floor(random(1,100000));
        let b = floor(random(1,100000));
        coPrime = gcd(a,b);
        if (coPrime == 1) {
            cntCoPrime++;
        }
        cntTotal++;
    }
}

function mouse_(x,y) {
    calc(1000);
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

function draw() {
    background("#f0e7fa");
    rate.html(' Exécution en '+round(deltaTime)+' ms');
    //---
    // Main

    calc(1000000);
    PIapp = Math.sqrt(6 * cntTotal / cntCoPrime);
    textAlign(LEFT,CENTER);
    textSize(24);
    noStroke();
    fill('#3700B3');
    text("Approximation de PI par l'Algorithme d'Euclide",50,120);
    text("La propabilité que deux nombres entiers soient coprime est égale à 6/(PI2)",50,150);

    textSize(48);
    textAlign(CENTER,CENTER);
    rectMode(CENTER);
    let txt = PIapp.toString();
    const n = 12;
    const dec = width/n/2;
    for (let i = 0;i<n;i++) {
        let v = txt[i];
        push();
        stroke('#63DAC5');strokeWeight(4);
        fill("#f0e7fa");
        translate(dec*(i)+width/4,height/2)
        rect(0,0,dec+2,dec+30,2);
        noStroke();
        fill('#3700B3');
        text(v,0,0);
        pop();
    }
    textSize(24);
    noStroke();
    fill('#3700B3');
    text('#'+cntTotal/1000000+' M opérations',width/3,height-150);

    //---
    textAlign(CENTER,CENTER);
    textSize(10); fill("#f0e7fa");noStroke();
    text('eCoucou '+eC.version, width-40, height-10);

// noLoop();
}