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
    RDPPoints.push(end);
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