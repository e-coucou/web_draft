 let canvas;

let gravity;
let ressorts = [];
let points = [];
let inter = 2;

function setup() {
    canvas = createCanvas(600, 800);
    canvas.parent('sketch-XXX');
    gravity = createVector(0,0.05);
    colorMode(HSB);
    for (let i=0; i<80 ; i ++) {
        points.push(new Particule(300, inter*i));
        if (i!==0) {
            ressorts.push(new Ressort(0.4,inter,points[i-1],points[i]))
        }
    }
    points[0].fixe = true;
    // points[points.length-1].fixe = true;
}

function draw() {
    background(0);

    if (mouseIsPressed) {
        points[points.length-1].pos.set(mouseX,mouseY);
        points[points.length-1].vel.set(0,0);
    }

    for (r of ressorts) {
        r.update();
        r.show();
    }
    for (p of points) {
        p.applyForce(gravity);
        p.update();
        // p.show();
    }
}