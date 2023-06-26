let canvas;

let g = 1;
let a1, a2;
let p0, p1, p2;
let l1 = 200,
    l2 = 150;
let m1 = 0.7,
    m2 = 1.07;
let a1v = 0,
    a2v = 0;
var trace = [];

let r1 = 10 * Math.sqrt(m1),
    r2 = 10 * Math.sqrt(m2);

function setup() {
    canvas = createCanvas(800, 600);
    canvas.parent('sketch-XXX');
    // colorMode(HSB);
    p0 = createVector(width / 2, 100);
    p1 = createVector(0, 0);
    p2 = createVector(0, 0);
    a1 = PI / 4;
    a2 = PI / 2;
    // frameRate(2);
}

function draw() {
    background(0);
    // compute Theta derivee seconde = accélération 
    let n = -g * (2 * m1 + m2) * sin(a1) - m2 * g * sin(a1 - 2 * a2) - 2 * sin(a1 - a2) * m2 * (a2v * a2v * l2 + a1v * a1v * l1 * cos(a1 - a2));
    let d = l1 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));
    const a1a = (n) / d;
    n = a1v * a1v * l1 * (m1 + m2) + g * (m1 + m2) * cos(a1) + a2v * a2v * l2 * m2 * cos(a1 - a2);
    d = l2 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));
    const a2a = 2 * sin(a1 - a2) * n / d;

    a1v += a1a;
    a2v += a2a;
    a1 += a1v;
    a2 += a2v;

    p1.x = l1 * sin(a1) + p0.x;
    p1.y = l1 * cos(a1) + p0.y;
    p2.x = l2 * sin(a2) + p1.x;
    p2.y = l2 * cos(a2) + p1.y;

    trace.push(p2.copy());

    fill(255);
    stroke(255);
    strokeWeight(3);
    line(p0.x, p0.y, p1.x, p1.y);
    circle(p1.x, p1.y, 2 * r1);
    line(p1.x, p1.y, p2.x, p2.y);
    circle(p2.x, p2.y, 2 * r2);

    for (let t of trace) {
        stroke(155);
        strokeWeight(3);
        point(t.x, t.y);
    }

    if (trace.length > 1000) trace.shift();
}