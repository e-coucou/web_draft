class Ressort {
    constructor(_k,_e,_a,_b) {
        this.k = _k;
        this.e = _e;
        this.a = _a;
        this.b = _b;
    }

    update() {
    let force = p5.Vector.sub(this.b.pos,this.a.pos);
    let x = force.mag() - this.e;
    force.normalize();
    force.mult(-this.k * x)

    // F = m x a
    this.b.applyForce(force);
    force.mult(-1);
    this.a.applyForce(force);

    }

    show() {
        stroke(255);
        strokeWeight(5);
        noFill();
        line(this.a.pos.x, this.a.pos.y, this.b.pos.x, this.b.pos.y);

    }
}