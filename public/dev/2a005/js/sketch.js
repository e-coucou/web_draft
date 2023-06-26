let canvas;

let gravity = 1,
    vent, aero = 0.5;

let origine, pendules = [];

function setup() {
    canvas = createCanvas(600, 700);
    canvas.parent('sketch-XXX');
    // colorMode(HSB);
    origine = createVector(width / 2, 0);
    let test = createVector(200, 500);
    pendules.push(new Pendule(PI / 4, 300, 8, origine));
    pendules.push(new Pendule(PI / 3, 200, 2, pendules[0].pos));
    // gravity = createVector(0, 0.1);
}

function draw() {
    background(0, 120);
    for (let p of pendules) {
        p.applyForce(gravity / p.masse);
        p.show();
    }
}