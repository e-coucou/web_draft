class Vector {
    constructor(a,b,c=0) {
        this.e = [a,b,c];
    }
    x() { return this.e[0];}
    y() { return this.e[1];}
    z() { return this.e[2];}

    zero() {
        this.e = [0,0,0];
    }

    copy() {
        return new Vector(this.x(),this.y(),this.z());
    }

    random(vmin=0,vmax=1) {
        this.e = [random(vmin,vmax) , random(vmin,vmax), random(vmin,vmax)];
    }
    static random(vmin=0,vmax=1) {
        this.e = [random(vmin,vmax) , random(vmin,vmax), random(vmin,vmax)];
    }

    add(v) { //add vector
        this.e[0] += v.e[0];
        this.e[1] += v.e[1];
        this.e[2] += v.e[2];
        return(this);
    }
    sub(v) { //add vector
        this.e[0] -= v.e[0];
        this.e[1] -= v.e[1];
        this.e[2] -= v.e[2];
        return(this);
    }
    mult(s) { // mult by scalar
        this.e[0] *= s;
        this.e[1] *= s;
        this.e[2] *= s;
        return(this);
    }
    distSq() { // distance au carré
        return (this.e[0]*this.e[0] + this.e[1]*this.e[1] + this.e[2]*this.e[2]);
    }
    distSq2D() { // distance au carré
        return (this.e[0]*this.e[0] + this.e[1]*this.e[1]);
    }

    dist() {
        return (Math.sqrt(this.distSq()));
    }
    dist2D() {
        return (Math.sqrt(this.distSq2D()));
    }

    heading() {
        return atan2(this.e[1],this.e[0]) + PI;
    }

    setMag(mag) {
        let r = mag / this.dist();
        this.e = this.e.map(x=>x*r);
    }
    setMag2D(mag) {
        let r = mag / this.dist2D();
        this.e = this.e.map(x=>x*r);
    }
    limit(seuil) {
        let d = this.dist();
        if (d>seuil) {
            this.e = this.e.map(x=>x*seuil/d);
        }
    }
    limit2D(seuil) {
        let d = this.dist2D();
        if (d>seuil) {
            this.e = this.e.map(x=>x*seuil/d);
        }
    }

    static distSq(v) { // distance au carré
        return (v.e[0]*v.e[0] + v.e[1]*v.e[1] + v.e[2]*v.e[2]);
    }
    static distSq2D(v) { // distance au carré
        return (v.e[0]*v.e[0] + v.e[1]*v.e[1]);
    }

    static dist(v) {
        return (Math.sqrt(Vector.distSq(v)));
    }
    static dist2D(v) {
        return (Math.sqrt(Vector.distSq2D(v)));
    }

    static add(u,v) {
        return new Vector(u.e[0]+v.e[0],u.e[1]+v.e[1],u.e[2]+v.e[2]);
    }
    static sub(u,v) {
        return new Vector(u.e[0]-v.e[0],u.e[1]-v.e[1],u.e[2]-v.e[2]);
    }
    static mult(v,s) {
        return new Vector(v.e[0]*s,v.e[1]*s,v.e[2]*s);
    }
    static dot(u,v) {
        return(u.e[0]*v.e[0]+u.e[1]*v.e[1]+u.e[2]*v.e[2]);
    }
    static dot2D(u,v) {
        return(u.e[0]*v.e[0]+u.e[1]*v.e[1]);
    }
    static cross(u,v,w) { // produit vectoriel
        return( (v.e[0]-u.e[0])*(w.e[1]-u.e[1]) - (w.e[0]-u.e[0])*(v.e[1]-u.e[1]) );
    }
    static mat(u,v) {
        return new Vector ( u.e[1]*v.e[2]-u.e[2]*v.e[1] , u.e[2]*v.e[0]-u.e[0]*v.e[2] , u.e[0]*v.e[1]-u.e[1]*v.e[0] );
    }
    static norm(v) {
        return ( Vector.mult(v,1/Vector.dist(v)));
    }
    static norm2D(v) {
        return ( Vector.mult(v,1/Vector.dist2D(v)));
    }
    static setMag2D(v,mag) {
        let r = mag / v.dist2D();
        let ret = v.copy();
        ret.e = ret.e.map(x=>x*r);
        return ret;
    }
}