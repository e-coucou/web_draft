class Particule {
    constructor(_x, _y, _m) {
        this.pos = createVector(_x, _y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.masse = _m;
        this.r = sqrt(this.masse) * 7;
        this.couleur = 255;
        this.fixe = false;
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }
    frein(cx) {
        let f = p5.Vector.mult(this.vel, -1).normalize();
        // let f = this.vel.copy();
        // f.normalize();
        // f.mult(-1);
        let vel2 = this.vel.magSq();
        f.setMag(vel2 * cx);
        this.applyForce(f);
    }

    applyForce(force) {
        let f = p5.Vector.div(force, this.masse);
        this.acc.add(f);
    }

    edges() {
        if (this.pos.y > height - this.r) {
            this.pos.y = height - this.r;
            this.vel.y *= -1;
        }
        if (this.pos.x > width - this.r) {
            this.pos.x = width - this.r;
            this.vel.x *= -1;
        }
        if (this.pos.x < this.r) {
            this.pos.x = this.r;
            this.vel.x *= -1;
        }
    }

    show() {
        noStroke();
        // const couleur = color('hsba('+this.color+', 100%, 100%,1)');
        fill(this.couleur, 155);
        circle(this.pos.x, this.pos.y, this.r * 2);
    }
}