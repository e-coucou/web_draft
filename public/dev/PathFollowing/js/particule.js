class Particule {
    constructor (x_,y_) {
        this.pos = createVector(x_, y_);
        this.vel = createVector(0,0);
        this.acc = createVector(0,0);
        this.maxVel = 3;
        this.maxForce = 0.2;
        this.idPath = 0;
    }

    update() {
        this.vel = this.vel.add(this.acc);
        this.pos = this.pos.add(this.vel);
        this.acc.mult(0);
    }

    applyForce(f_) {
        this.acc.add(f_);
        this.acc.limit(this.maxForce);
    }

    seek(t_) {
        let desired = p5.Vector.sub(t_, this.pos);
        desired.normalize().mult(this.maxVel);
        let steer = p5.Vector.sub(desired, this.vel);
        this.applyForce(steer);
    }
    
    projection(p_, s_, e_) { // p=point, s=start , e=end
        let v0 = p5.Vector.sub(p_, s_);
        let v1 = p5.Vector.sub(e_, s_);
        v1.normalize();
        let d =  v0.dot(v1);
        v1.mult(d);
        return v1.add(s_);
    }
    
    follow(p_) { // path
        let next = this.vel.copy();
        next.mult(20);
        next.add(this.pos);
        this.plot(next);
        let minD = Infinity;
        let sel = null;
        for (let i=this.idPath; i<p_.path.length-1; i++) {
            let start = p_.path[i];
            let end = p_.path[i+1];
            let proj = this.projection(next, start, end);
            // est ce que proj 
            let d = p5.Vector.dist(proj, next);
            if (d<minD) {
                minD = d;
                sel = proj;
                this.idPath = i;
            }
        }
        if (sel != null) {
            this.plot(sel);
            let d = p5.Vector.dist(sel, next);
            if ( d> p_.rayon/2) {
                this.seek(sel);
            }
        }
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

    plot(p_,c_=color(255,0,0)) {
        noFill();
        stroke(0,0,255);
        strokeWeight(1);
        circle(p_.x, p_.y, 5);
    }

    edge() {
        if (this.pos.x < 0 || this.pos.x > width) {
            this.vel.x *= -1;
        }
        if (this.pos.y < 0 || this.pos.y > height) {
            this.vel.y *= -1;
        }
    }

    show() {
        fill(255);
        noStroke();
        circle(this.pos.x, this.pos.y , 10);
        let p = p5.Vector.mult(this.vel, 10);
        let next = p5.Vector.add(this.pos,p);
        stroke(0,255,0);
        strokeWeight(2);
        line(this.pos.x, this.pos.y, next.x, next.y);
    }
}