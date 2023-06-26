class Pendule {
    constructor(_a, _l, _m, _parent) {
        this.pos = createVector();
        this.angle = _a;
        this.corde = _l;
        this.vel = 0;
        this.acc = 0;
        this.parent = _parent;
        this.masse = _m;
        this.r = sqrt(this.masse) * 7;
        this.couleur = 255;
    }

    update() {
        this.vel += this.acc;
        this.angle += this.vel;
        this.pos.x = this.corde * sin(this.angle) + this.parent.x;
        this.pos.y = this.corde * cos(this.angle) + this.parent.y;
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
        let corde = dist(this.pos.x, this.pos.y, origine.x, origine.y);
        let angle = atan2(this.pos.x - origine.x, this.pos.y - origine.y);
        let f = force * sin(this.angle);
        this.acc = -f / corde;
        this.update();
    }

    show() {
        noStroke();
        // const couleur = color('hsba('+this.color+', 100%, 100%,1)');
        fill(this.couleur, 155);
        stroke(255);
        line(this.parent.x, this.parent.y, this.pos.x, this.pos.y);
        circle(this.pos.x, this.pos.y, this.r * 2);
    }
}