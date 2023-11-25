class formCercle {
    constructor(v , r) {
        this.o = new Vector(v.x, v.y);
        this.r = r; 
        this.couleur = color(0);
    }

    SDF(v) {
        return (Vector.sub(this.o,v).dist() - this.r);
    }

    setColor(c) {
        this.couleur = color(c);
    }

    show() {
        ellipseMode(RADIUS);
        stroke(this.couleur);fill(this.couleur);
        push();
        translate(this.o.x, this.o.y);
        circle(0,0,this.r);
        pop();
    }
}

class formRect {
    constructor(v , s) {
        this.o = new Vector(v.x, v.y);
        this.s = new Vector(s.x, s.y); 
        this.couleur = color(0);
    }

    SDF(v) {
        let offset = Vector.sub(Vector.sub(this.o,v).abs(),this.s);
        let uDist = Vector.max(offset,0).dist();
        let sDist = Vector.min(offset,0).max();
        return (uDist + sDist);
    }

    show() {
        rectMode(RADIUS);
        stroke(this.couleur);fill(this.couleur);
        push();
        translate(this.o.x, this.o.y);
        rect(0,0,this.s.x, this.s.y);
        pop();
    }
}

class formMur {
    constructor(a, b) {
        this.a = a;
        this.b = b;
        this.dir = Vector.sub(a,b).norm().ortho();
        this.couleur = color(0);
    }

    SDF(v) {
        let vN = Vector.add(v,this.dir);
        let p = Math.min(Vector.dist(v,this.a),Vector.dist(v,this.b));
        let [r,it] = castDir(v,vN,this.a,this.b);
        if (r)  {
            p = Math.min(Vector.dist(v,it),p);
        }
        return(p);
    }

    show() {
        stroke(this.couleur);fill(this.couleur);
        ligne(this.a,this.b);
    }
}

function projection(c, a, b) {
    let A = p5.Vector.sub(a, c);
    let B = p5.Vector.sub(b, c);
    B.normalize();
    let p =  A.dot(B);
    B.mult(p);
    return B.add(c);
}
