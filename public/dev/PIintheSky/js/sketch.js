const eC = {version: 'v1.0', release:'r0', date:'apr/24', owner: 'rky', code:'y2I', annee:'2024', maj:'apr/24'};
let mobile;
let DEBUG = false, VERBOSE = false, LOOP = false, DENSITE = false;

let startTime, endTime;

let pies = [];
let raquette;
let message;
let PI_, left='3.', right, digit=1, nbDigit=2;

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
    PI_ = loadStrings('../../data/pi_million.txt');
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
    message = '';

    // btReplay = createButton("↩️ Replay");
    // btReplay.mousePressed(fctReplay);
    // btReplay.parent("#canvas");
    // btReplay.class("styled_2");
    PI_ = PI_.join('');
    windowResized();

    initCouleur();
    raquette = new Raquette(width/2, height-25);

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

function nextDigit() {
    left += digit;
    left = PI_.substring(nbDigit-20,nbDigit-1);
    nbDigit += 1;
    digit = int(PI_.charAt(nbDigit));
}

function draw() {
    background("#f0e7fa");
    rate.html(' Exécution en '+round(deltaTime)+' ms');
    //---
    // Main

    if (frameCount % 2 == 0) {
        if (random()<0.2) {
            pies.push(new PIe(random(width),random(-100,-30)));
        }
    }

    for (let  i=pies.length-1;i>=0;i--) {
        let p = pies[i]
        p.update();
        p.show();
        if (p.edge()) {
            pies.splice(i,1);
        }
        if (raquette.catch(p)) {
            message += p.num;
            if (p.num == digit) nextDigit();
            pies.splice(i,1);
            // console.log('get')
        }

    }

    raquette.update();
    raquette.show(nbDigit-2);

    textSize(30);
    fill("#018786");
    right = PI_.substring(nbDigit+1,20+nbDigit);
    textAlign(RIGHT,CENTER);
    text(left,width/2-35,30);
    textAlign(LEFT,CENTER);
    text(right,width/2+35,30);
    textAlign(CENTER,CENTER);
    rectMode(CENTER,CENTER);
    fill('#f0e7fa');
    stroke('#63DAC5');
    strokeWeight(4);
    rect(width/2,30,55,55,5);
    noStroke();
    strokeWeight(1);
    textSize(50);
    fill("#f65105");
    text(PI_.charAt(nbDigit),width/2,30);
    // text(message,width/2,30);


    //---
    textAlign(CENTER,CENTER);
    textSize(10); fill("#f0e7fa");noStroke();
    text('eCoucou '+eC.version, width-40, height-10);

// noLoop();
}