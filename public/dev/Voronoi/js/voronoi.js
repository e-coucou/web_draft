let sites = [];

class Parabole {
    constructor(f) {
        this.f = f;
        this.on = true;
        this.reset();
    }
    reset() {
        this.inter = [];
        this.minX = offset;
        this.maxX = width - offset;
    }
    record(a,b,D) {
        if (a>0 && a>this.minX && a<this.maxX && a< width-offset) {
            let y = this.fctY(a,D);
            if (y>offset) sites.push( new Vector(a,y,0));
        }
        if (b>0 && b>this.minX && b<this.maxX && b<width)
        {
            let y = this.fctY(b,D);
            if (y>offset) sites.push( new Vector(b,y,0));
        }
    }
min(v) {
    if (v>this.minX) this.minX = v;
}
max(v) {
    if (v<this.maxX) this.maxX = v;
}
limite(a,b) {
    this.inter.push({a:a,b:b});
    let v = a;
    if (b>v) v = b;

    if (v>this.minX) this.minX = v;
    if (v<this.maxX) this.maxX = v;
}

intersection(fb, d) {
    let den = this.f.y() - fb.y();
    let rac = (this.f.y()-d)*(fb.y()-d) * ( Math.pow(this.f.x()-fb.x(),2) + Math.pow(this.f.y()-fb.y(),2));
    let num = fb.x()*(this.f.y()-d) - this.f.x()*(fb.y()-d) ;
    let a =  (num - Math.sqrt(rac) ) / den;
    let b =  (num + Math.sqrt(rac) ) / den;
    return [a,b];
}

    fctY(x,D) {
        let p = - this.f.y() + D;
        let y = D - p/2 - Math.pow(x - this.f.x(), 2) / 2 / p;
        return y;
    }
 

    show(D) {
        noFill();
        stroke(255);
        if (this.on) {
            let p = - this.f.y() + D;
            for (let x=offset; x<width-offset;x++) {
            // for (let x=this.minX;x<this.maxX;x++) {
                stroke(120);
                if (x>this.minX & x<this.maxX) stroke(255);
                let y = D - p/2 - Math.pow(x - this.f.x(), 2) / 2 / p;
                point(x,y);
            }
        }
    }
}

class Germe {
    constructor(pt) {
        this.pt = pt;
        this.P = new Parabole(pt);
    }

    reset() {
        this.P.reset();
    }

    intersection(g,D) {
        let [a,b] = this.P.intersection(g.pt,D);

        this.P.record(a,b,D);
        // if (a>0) sites.push( new Vector(a,this.P.fctY(a,D),0));
        // if (b>0 && b<width) sites.push( new Vector(b,this.P.fctY(b,D),0));

        if (this.pt.x() < g.pt.x()) {
            if (a>0 && a<b) {
            // if (a<g.pt.x() && a>this.pt.x()) {
                this.P.min(a);
                this.P.max(b);
                g.P.min(b);
            } else {
                if (b>0) {
                    // if (b<g.pt.x() && b>this.pt.x()) {
                    g.P.min(b);
                    this.P.max(b);
                }
            }
        } else {
            if (a>0 && a<b) {
                // if (a>g.pt.x() && a<this.pt.x()) {
                g.P.max(a);
                this.P.min(a);
                this.P.max(b);
            } else {
                if (b>0) {
                    // if (b>g.pt.x() && b<this.pt.x()) {
                    g.P.max(b);
                    this.P.min(b);
                }
            }
        }
    }
    show(D) {
        fill(255);stroke(255);
        circle(this.pt.x(), this.pt.y(),5);
        if (D > this.pt.y()) {
            this.P.show(D);
        }

    }
}

class Voronoi {
    constructor() {
        this.germes = [];
        sites = [];
    }

    add(g) {
        this.germes.push(g);
    }

    update(D) {
        this.germes.sort((a,b)=>{return b.pt.y() - a.pt.y() ; })
        for (let g of this.germes) {
            g.reset();
        }
        for (let i=0;i<this.germes.length-1; i++) {
            let g = this.germes[i];
            if (g.pt.y()<D) {
                for (let j=i+1; j<this.germes.length;j++) {
                    let h = this.germes[j];
                    if (h != g && h.pt.y()<D) {
                        g.intersection(h,D);
                    }
                }
            }
        }
    }

    show(D) {
        for (let g of this.germes) {
            g.show(D);
        }

        noFill(); stroke(255,0,0); strokeWeight(1);
        for (let v of sites) {
            point(v.x(),v.y());
        }
    }
}