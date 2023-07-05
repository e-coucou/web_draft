let points = [];
let RDPPoints = [];
let epsilon;
let start, stop;

function setup() {
    canvas = createCanvas(600,300);
    canvas.parent('#canvas');

    for (let x=0; x< width ; x++) {
        let a = map(x, 0, width, 0, 5.);
        let fa = exp(-a) * cos(TWO_PI * a);
        let y = map(fa, -1, 1, height, 0);
        points.push(createVector(x,y));
    }
    start = points[0];
    end = points[width-1];
    RDPPoints.push(start);
    rdp(0, points.length-1, points, RDPPoints);
    RDPPoints.push(end);
}

function rdp(startId, endId, points, rdpPoints) {
    let nextId = projectionMax(points, startId, endId);
    while (nextId > 0) {
        rdpPoints.push(points[nextId]);
        if (startId != nextId) {
            rdp(points, startId, nextId, rdpPoints);
        }
        if (nextId != endId) {
            rdp(points, nextId, endId, rdpPoints);
        }
    }
}

function distLigne(a, b, c) { // distance projeté
    return 100;
}

function projectionMax(points, a, b) {
    let distMax = -1;
    let start = points[a];
    let end = points[b];
    for (let i = a+1; i<b ; i++) {
        let c = points[i];
        let d = distLigne(c, start, end);
        if (c>distMax) {
            distMax = c;
            retIndex = i; // le point le plus loin
        }
    }
    if (distMax>epsilon) {
        return retIndex;
    } else { return -1; }
}

function draw() {
    background(0);
    stroke(255);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let p of points) {
        vertex(p.x,p.y);
    }
    endShape();

    stroke(255,0,255);
    beginShape();
    for (let p of RDPPoints) {
        vertex(p.x,p.y);
    }
    endShape();
}