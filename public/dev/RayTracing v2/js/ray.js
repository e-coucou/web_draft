class Ray {
    constructor(pos, angle) {
        this.pos = pos;
        this.dir = p5.Vector.fromAngle(angle);
    }

    show() {
        stroke(255);
        push();
        translate(this.pos.x,this.pos.y);
        // circle(0,0,4);
        line(0,0,this.dir.x * 3, this.dir.y*3);
        pop();
    }

    setDir(x,y) {
        this.dir.x = x - this.pos.x;
        this.dir.y = y - this.pos.y;
        this.dir.normalize();
    }

    cast(mur) {
        const x1 = mur.a.x;
        const y1 = mur.a.y;
        const x2 = mur.b.x;
        const y2 = mur.b.y;

        const x3 = this.pos.x;
        const y3 = this.pos.y;
        const x4 = x3 + this.dir.x;
        const y4 = y3 + this.dir.y;

        const den = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4);
        if (den===0) {
            return; // droite parallele;
        } else {
            const t =   ( (x1-x3)*(y3-y4) - (y1-y3)*(x3-x4) ) / den;
            const u = - ( (x1-x2)*(y1-y3) - (y1-y2)*(x1-x3) ) / den;
            if (t>0 && t<1 && u>0) {
                let p = createVector();
                p.x = x1 + t*(x2-x1);
                p.y = y1 + t*(y2-y1);
                return p;
            } else {
                return;
            }
        }

    }
}