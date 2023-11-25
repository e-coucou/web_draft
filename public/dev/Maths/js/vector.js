
class Vector {
    constructor(a,b,c=0) {
        this.x = a;
        this.y = b;
        this.z = c;
        this.l = this.dist();
    }

    set(x,y,z=0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.l = this.dist();
    }
    showPt(r=1) {
        fill(255);noStroke();
        circle(this.x,this.y,r);
    }

    showPxl(){
        noFill(),strokeWeight(1),stroke(255);
        point(this.x,this.y);
    }

    dist() {
        return Math.sqrt(this.x*this.x + this.y*this.y );
    }

    ortho() {
        return (new Vector(-this.y,this.x));
    }

    static dist(a,b) {
        let v = Vector.sub(a,b);
        return v.dist();
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        // return(this);
    }
    sub(v) {
        this.x += v.x;
        this.y += v.y;
    }
    mult(d) {
        this.x *= d;
        this.y *= d;
        return(this);
    }
    norm() {
        let l = this.dist();
        return (new Vector(this.x/l,this.y/l));
    }
    dot(v){
        return (v.x*this.x+v.y*this.y);
    }
    static add(a,b) {
        return ( new Vector(a.x+b.x, a.y+b.y));
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
    static mult(v,d) {
        let x = v.x * d;
        let y = v.y *d;
        return new Vector(x,y);
    }
    max() {
        return Math.max(this.x,this.y);
    }
    copie() {
        return new Vector(this.x,this.y);
    } 
}