let points = [];
let RDPPoints = [];
let epsilon=0.1;
let debut, fin;
let total;

let iter = 0;

function windowResized() {
    resizeCanvas(windowWidth,windowHeight/3);
    points=[];
    for (let x=0; x< width ; x++) {
        let a = map(x, 0, width, 0, 5.);
        let fa = exp(-a) * cos(TWO_PI * a);
        let y = map(fa, -1, 1, height, 0);
        points.push(createVector(x,y));
    }
    total = points.length - 1;
}
function setup() {
    canvas = createCanvas(innerWidth,innerHeight/3);
    canvas.parent('#canvas');
    epsilon=0.1;
    windowResized();
    frameRate(10);

}

function rdp(startId, endId, points, RDPPoints) {
    let nextId = projectionMax(points, startId, endId);
    if (nextId > 0) {
        if (startId != nextId) {
            rdp(startId, nextId, points, RDPPoints);
        }
        RDPPoints.push(points[nextId]);
        if (nextId != endId) {
            rdp(nextId, endId, points,  RDPPoints);
        }
    }
}

function projection(c, a, b) { // pivot = c
    let A = p5.Vector.sub(c, a);
    let Bn = p5.Vector.sub(b, a).normalize();
    let p =  A.dot(Bn);
    Bn.mult(p);
    return p5.Vector.add(a,Bn);
}


function distLigne(c, a, b) { // distance projeté
    let norm = projection(c, a, b); // pivot = a
    return p5.Vector.dist(c, norm);
}

function projectionMax(points, a, b) {
    let distMax = -1;
    let start = points[a];
    let end = points[b];
    for (let i = a+1; i<b ; i++) {
        let c = points[i];
        let d = distLigne(c, start, end);
        if (d>distMax) {
            // console.log(distMax);
            distMax = d;
            retIndex = i; // le point le plus loin
        }
    }
    if (distMax > epsilon) {
        return retIndex;
    } else { return -1; }
}

function affiche() {
    stroke(255);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let pt of points) {
        vertex(pt.x,pt.y);
    }
    endShape();

    stroke(255,0,255);
    strokeWeight(2);
    beginShape();
    for (let pt of RDPPoints) {
        vertex(pt.x,pt.y);
    }
    endShape();

    stroke(255);
    strokeWeight(1);
    textAlign(RIGHT,CENTER);
    let xT = width - 20;
    let yT = 20;
    text('Précision (epsilon) : '+nf(epsilon,0,1)+' px', xT, yT); yT+=20;
    text('#points initiaux '+nf(points.length,0,0), xT, yT); yT+=20;
    text('#points réduits '+nf(RDPPoints.length,0,0), xT, yT); yT+=30;
    textSize(14);
    text('RATIO : '+nf(RDPPoints.length/points.length*100,0,1)+' %', xT, yT); yT

}

function draw() {
    background(0);
    // a chaque itération on auglente epsilon
    RDPPoints = [];
    debut = points[0];
    fin = points[total];
    RDPPoints.push(debut);
    rdp(0, total, points, RDPPoints);
    RDPPoints.push(fin);
    affiche();
    epsilon += 0.01;
    if (epsilon> 10) epsilon=0.1; 
}