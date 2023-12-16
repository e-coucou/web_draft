class Vector {
    constructor(a,b,c) {
        this.e = [a,b,c];
    }
    x() { return this.e[0];}
    y() { return this.e[1];}
    z() { return this.e[2];}

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

    dist() {
        return (Math.sqrt(this.distSq()));
    }

    static distSq(v) { // distance au carré
        return (v.e[0]*v.e[0] + v.e[1]*v.e[1] + v.e[2]*v.e[2]);
    }

    static dist(v) {
        return (Math.sqrt(Vector.distSq(v)));
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
    static mat(u,v) {
        return new Vector ( u.e[1]*v.e[2]-u.e[2]*v.e[1] , u.e[2]*v.e[0]-u.e[0]*v.e[2] , u.e[0]*v.e[1]-u.e[1]*v.e[0] );
    }
    static norm(v) {
        return ( Vector.mult(v,1/Vector.dist(v)));
    }
}