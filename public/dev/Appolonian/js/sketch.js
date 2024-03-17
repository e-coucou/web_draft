const eC = {version: 'v1.1', release:'r0', date:'mar/24', owner: 'rky', code:'y2I', annee:'2024', maj:'mar/24'};
let mobile;
let DEBUG = false, VERBOSE = false, LOOP = false, DENSITE = false;

let startTime, endTime;

let cercles = [];
let queue = [];
let c0, level=0;
const epsilon = 0.1;

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

function init(c, nouv=true) {
    queue = [];
    c.setRecur();
    if (nouv) {
        level = 0;
        cercles = [];
        cercles.push(c);
    } else {
        level += 1;
        c.level = level;
        c.k = -c.k; // le cercle initial à une curvature négative !!
    }
    let min_ = min(100,c.r*0.65);
    let r = random(min_,c.r*0.85);
    let v = p5.Vector.random2D();
    v.setMag(c.r - r);
    let c1 = (new Cercle(1/r,c.x+v.x,c.y+v.y,level));
    r=v.mag();
    v.rotate(PI);
    v.setMag(c.r - r);
    let c2 = (new Cercle(1/r,c.x+v.x,c.y+v.y,level));
    cercles.push(c1);
    cercles.push(c2);
    queue.push([c, c1, c2]);
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

    c0 = new Cercle(-1/width*2,width/2, height/2,level); // le cercle initial à une curvature négative
    init(c0);
}

function mousePressed() {
    let newC = c0;
    for (let c of cercles) {
        if (c.in(mouseX,mouseY))
        newC = c;
    }
    init(newC,(newC==c0));
}

function touchPressed() {
    mousePressed();
}

function isValid(c,t) {
    if (c.r<1) return false;
    for (let o of cercles) {
        if (o.level == level) {
            let d = c.dist(o);
            let deltaR = Math.abs(c.r - o.r);
            if (d<epsilon && deltaR<epsilon) return false;
        }
    }
    if (!isTangent(c,t[0])) return false;
    if (!isTangent(c,t[1])) return false;
    if (!isTangent(c,t[2])) return false;

    return true;
}

function isTangent(c1,c2) {
    let d = c1.dist(c2);
    let a = Math.abs(d - (c1.r + c2.r))<epsilon;
    let b = Math.abs(d - Math.abs(c2.r-c1.r))<epsilon;
    return (a||b);
}

function nextGen() {
    let newQ = [];
    for (let t of queue) {
        let newCercles = DescartesComplex(t);
        for (let c of newCercles) {
            if (isValid(c,t)) {
                cercles.push(c);
                newQ = newQ.concat([[c,t[0],t[1]], [c,t[0],t[2]], [c, t[1], t[2]]]);
            }
        }
    }
    queue=newQ;
}


function draw() {
    background(0);
    rate.html(' Exécution en '+round(deltaTime)+' ms');

    for (let c of cercles) {
        c.show();
    }

    if (queue.length>0) nextGen();

    textAlign(CENTER,CENTER);
    textSize(10); fill("#000000");noStroke();
    text('eCoucou '+eC.version, width-40, height-10);

// noLoop();
}

function Descartes(t) {
    let somme = t[0].k +t[1].k +t[2].k;
    let racine = 2 * Math.sqrt( Math.abs(t[0].k*t[1].k + t[0].k*t[2].k + t[1].k*t[2].k));
    return [somme + racine, somme-racine]; 
}

function DescartesComplex(t) {
    
    let k4 = Descartes(t);

    let zk1 = t[0].centre.scalar(t[0].k);
    let zk2 = t[1].centre.scalar(t[1].k);
    let zk3 = t[2].centre.scalar(t[2].k);

    let somme = zk1.add(zk2).add(zk3);
    let racine = zk1.mul(zk2).add(zk1.mul(zk3)).add(zk2.mul(zk3));
    racine = racine.sqrt().scalar(2);

    let ret = [];
    ret.push( new Cercle(k4[0], somme.add(racine).scalar(1/k4[0]).re, somme.add(racine).scalar(1/k4[0]).im, level));
    ret.push( new Cercle(k4[0], somme.sub(racine).scalar(1/k4[0]).re, somme.sub(racine).scalar(1/k4[0]).im, level));
    ret.push( new Cercle(k4[1], somme.add(racine).scalar(1/k4[1]).re, somme.add(racine).scalar(1/k4[1]).im, level));
    ret.push( new Cercle(k4[1], somme.sub(racine).scalar(1/k4[1]).re, somme.sub(racine).scalar(1/k4[1]).im, level));
    return ret;
}