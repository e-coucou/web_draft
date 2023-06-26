class Spring {
    constructor(k_, l_, p0,p1) {
        this.k = k_;
        this.l = l_;
        this.a = p0;
        this.b = p1;
    }


    update() {
        let force = p5.Vector.sub(this.b.pos,this.a.pos);
        let x = force.mag() - this.l;
        force.normalize();
        force.mult(this.k*x); 
        this.a.applyForce(force);
        force.mult(-1);
        this.b.applyForce(force);
    }

    show() {
        strokeWeight(1);
        stroke(255);
        line(this.a.pos.x, this.a.pos.y, this.b.pos.x, this.b.pos.y); 

    }
}