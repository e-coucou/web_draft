class Vector {
    constructor(a,b,c) {
        this.e = [a,b,c];
    }
    x() { return this.e[0];}
    y() { return this.e[1];}
    z() { return this.e[2];}

    set(x,y,z=0){
        this.e = [x,y,z];
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


class Roue {
    constructor(centre,ray) {
        this.c = centre;
        this.r = ray;
        this.l = this.r.dist();
    }

    update(dt) {
        let x = Math.cos(-dt - PI/2);
        let y = Math.sin(-dt - PI/2);
        this.r.set(x*this.l,y*this.l,0);
        this.c.e[0] = 100 +dt * this.l;
        return(Vector.add(this.c,this.r));

    }

    show() {
        noFill();
        stroke(255);
        push();
        translate(this.c.x(),this.c.y());
        circle(0,0,this.l*2);
        line(0,0,this.r.x(),this.r.y());
        fill(0,255,255);
        circle(this.r.x(),this.r.y(),6);
        pop();
    }
}