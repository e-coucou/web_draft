function ligne(A, B) {
    line(A.x, A.y, B.x, B.y);
}

class Ray {
    constructor(pos,angle) {
        this.pos = pos;
        this.dir = {x: Math.cos(angle*TWO_PI/360), y: Math.sin(angle*TWO_PI/360)};
    }

    show() {
        fill(255); stroke(255,30); strokeWeight(1);
        push();
        translate(this.pos.x, this.pos.y);
        ligne({x:0,y:0},this.dir);
        pop();
    }

    update(p) {
        this.pos = p;
    }

    dist(p) {
        return sqrt( (p.x-this.pos.x)*(p.x-this.pos.x) + (p.y-this.pos.y)*(p.y-this.pos.y));
    }

    projection(segments) {
        let rec=null, dMin=Infinity;
        for (let segment of segments) {
           let [r,p] = cast(this.pos, {x:this.dir.x+this.pos.x, y:this.dir.y+this.pos.y},segment.A, segment.B)
            if (r) {
                let d = this.dist(p);
                if (d<dMin) {
                    rec=p;
                    dMin = d;
                }
            }
        }
        if (rec != null) {
            fill(255); stroke(255); strokeWeight(1);
            ligne(this.pos, rec);
        }
    }
}


function cast(A,B,C,D) {
    let d = (A.x-B.x)*(C.y-D.y) - (A.y-B.y)*(C.x-D.x);
    let t = (A.x-C.x)*(C.y-D.y) - (A.y-C.y)*(C.x-D.x); t = t/d;
    let s = (A.x-C.x)*(A.y-B.y) - (A.y-C.y)*(A.x-B.x); s = s/d;
    if (s<1 & s>0 & t>0) { 
        let x=A.x + t*(B.x-A.x), y = A.y + t*(B.y-A.y); 
        return [true,{x:x,y:y}];
    }
    return [false,null];
}

class Segment {
    constructor(A,B) {
        this.A = A;
        this.B = B;
    }

    show() {
        fill(255); stroke(255); strokeWeight(1);
        ligne(this.A, this.B);
    }
}

class Particule {
    constructor(pos) {
        this.pos = pos;
        this.rays = [];
        for (let a=0;a<360;a+=1) {
            this.rays.push( new Ray(this.pos, a) );
        }
    }

    cast() {
    }
    update(p) {
        // this.pos.x += random(-2,2);
        // this.pos.y += random(-2,2);
        this.pos= p;
        // this.cast();
        for (let ray of this.rays) {
            ray.update(this.pos);
            ray.projection(murs);
        }
    }

    show() {
        fill(255); stroke(255); strokeWeight(1);
        circle(this.pos.x, this.pos.y, 1);
        for (let ray of this.rays) {
            ray.show();
        }
    }
}