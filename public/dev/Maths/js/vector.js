
class Vector {
    constructor(a,b) {
        this.x = a;
        this.y = b;
    }

    dist() {
        return Math.sqrt(this.x*this.x + this.y*this.y );
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
    }
    sub(v) {
        this.x += v.x;
        this.y += v.y;
    }
    static sub(a,b) {
        return ( new Vector(a.x-b.x, a.y-b.y));
    }
    abs() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        return(this);
    }
    static max(v,s) {
        let x = Math.max(v.x, s);
        let y = Math.max(v.y, s);
        return new Vector(x,y);
    }
    static min(v,s) {
        let x = Math.min(v.x, s);
        let y = Math.min(v.y, s);
        return new Vector(x,y);
    }
    max() {
        return Math.max(this.x,this.y);
    }
}

class formCercle {
    constructor(v , r) {
        this.o = new Vector(v.x, v.y);
        this.r = r; 
    }

    SDF(v) {
        return (Vector.sub(this.o,v).dist() - this.r);
    }

    show() {
        ellipseMode(RADIUS);
        stroke(255);fill(255);
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
    }

    SDF(v) {
        let offset = Vector.sub(Vector.sub(this.o,v).abs(),this.s);
        let uDist = Vector.max(offset,0).dist();
        let sDist = Vector.min(offset,0).max();
        return (uDist + sDist);
    }

    show() {
        rectMode(RADIUS);
        stroke(255);fill(255);
        push();
        translate(this.o.x, this.o.y);
        rect(0,0,this.s.x, this.s.y);
        pop();
    }
}