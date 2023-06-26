class Particule {
    constructor(x_,y_) {
        this.verrou=false;
        this.pos = createVector(x_,y_);
        this.vel = createVector(0,0.1);
        // this.vel = p5.Vector.random2D();
        this.acc = createVector(0,0);
        this.mass = 1;
        this.r = 5;
    }

    update() {
        if (!this.verrou) {
            this.vel.mult(0.99);
            this.vel.add(this.acc);
            this.pos.add(this.vel);
            this.acc.mult(0);
        }
    }

    applyForce(force) {
        let f = force.copy();
        f.div(this.mass);
        this.acc.add(f);
    }

    show() {
        noStroke();
        fill(25,200,120);
        circle(this.pos.x, this.pos.y, this.r);
    }
}