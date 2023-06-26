class Boid {
    constructor() {
        this.pos = createVector(width/2, height/2);
        this.vel = p5.Vector.random2D();
        this.acc = createVector();
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    show() {
        push();
        fill(255,120);
        noStroke();
        translate(this.pos.x, this.pos.y);
        circle(0,0,5);
        pop();
    }
}