const eC = {version: 'v1.0', release:'r0', date:'mar/24', owner: 'rky', code:'y2I', annee:'2024', maj:'mar/24'};
let mobile;
let DEBUG = false, VERBOSE = false, LOOP = false, DENSITE = false;

let startTime, endTime;

let gone;
let points = [];
let build, sel;
// const ratio = 0.7; //0.72474487139; //0.66;
const ratio = 0.61803398874989484820;
const N = 5;

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
    windowResized();

    gone = new Polygone(N,width/2*0.9,createVector(width/2, height/2));
    build = createVector(width/2,height/2);

}

function nextP(x,y) {
    build = (createVector(x,y));
    let n = int(random(N));
    sel = gone.points[n].pos;
    let d = build.dist(sel) * ratio;
    let a = p5.Vector.heading(p5.Vector.sub(sel,build));
    let x_ = build.x + d * Math.cos(a);
    let y_ = build.y + d * Math.sin(a);
    newP = createVector(x_,y_);
    points.push(new iPoint(newP,couleur[n]));
    return newP;
}

function mouse_(x,y) {
    nextP(x,y);
}

function touchStarted() {
    mouseSelection=true;
    let fs =fullscreen();
    console.log(fs);
    // if (!fs) { fullscreen(true);}
    // mouse_(touches[0].x, touches[0].y);
}

// function mousePressed() {
//     mouse_();
// }
function mouseClicked() {
    mouse_(mouseX,mouseY);
}

function draw() {
    background(0);
    rate.html(' Exécution en '+round(deltaTime)+' ms');

    for (let i=0;i<N;i++) {
        fill(couleur[i]);
        noStroke();
        rect(2,i*10+2,20,9,3);
    }
    gone.show();

    stroke(color(0,255,255));
    strokeWeight(3);
    point(build.x,build.y);
    strokeWeight(1);
    if (sel) {
        line(build.x, build.y, sel.x,sel.y);
        for (let i=0;i<1000;i++) {
            sel = nextP(sel.x,sel.y);
        }
    }

    for (let p of points) {
        p.show();
    }

    textAlign(CENTER,CENTER);
    textSize(10); fill("#000000");noStroke();
    text('eCoucou '+eC.version, width-40, height-10);

// noLoop();
}