class Ray {
    constructor(pos, dir) {
        this.origin = pos;
        this.dir = dir;
    }
    o() { return this.origin; }
    d() { return this.dir;}

    at(t) {
        return Vector.add(this.origin, Vector.mult(this.dir,t));
    }
}


function hitSphere(o,r,ray) {
    let oc = Vector.sub(ray.origin,o);
    let a = Vector.dot(ray.dir, ray.dir);
    let b = 2 * Vector.dot(oc,ray.dir);
    let c = Vector.dot(oc, oc) - r/2;
    let dt = b*b - 4*a*c; //discriminant
    if (dt<0) {
        return -1;
    } else {
        let ret = (-b +Math.sqrt(dt))/(4*a); //console.log(ret)
        return ret;
    }
    // return (dt >=0);
}