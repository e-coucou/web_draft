let canvas;

let gravity, vent, aero = 0.5;
let balls = [];

function setup() {
    canvas = createCanvas(600, 700);
    canvas.parent('sketch-XXX');
    // colorMode(HSB);

    for (let i = 0; i < 10; i++) {
        balls.push(new Particule(random(0, width), 0, random(2, 32)));
    }
    gravity = createVector(0, 0.1);
    vent = createVector(0.07, 0);

}

function draw() {
    background(0);
    //récipient
    fill(120, 155);
    rect(0, height / 2, width, height / 2);

    for (ball of balls) {
        let poids = p5.Vector.mult(gravity, ball.masse);
        ball.applyForce(poids);
        if (ball.pos.y > height / 2) {
            ball.frein(aero);
        } else {
            ball.applyForce(vent);
        }
        ball.update();
        ball.edges();
        ball.show();
    }
}