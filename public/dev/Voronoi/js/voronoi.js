let sites = [], points=[], gRest = [];

class Parabole {
    constructor(f) {
        this.f = f;
        this.on = true;
        this.reset();
    }
    reset() {
        this.inter = [];
        this.inter.push({a:offset, b:width-offset});
        this.on = true;
    }
    update(a,b,bas=true) {
        if (bas) {
            for (let i=this.inter.length-1;i>=0;i--) {
                let it = this.inter[i];
                if (b>=it.a & a<=it.b) {
                    if (a>it.a & b<it.b) {
                        this.inter.push({a:b,b:it.b})
                        it.b=a;
                    } else {
                        if (b>it.b) {it.b=a;}
                        if (a<it.a) {it.a=b;}
                    }
                } else {
                    //drop
                    // this.inter.splice(i,1);
                }
                if (it.a>it.b) this.inter.splice(i,1);
            }
        } else {
            for (let i=this.inter.length-1;i>=0;i--) {
                let it = this.inter[i];
                if (a>it.a & b<it.b) {
                    it.a=a;it.b=b;
                } else {
                    if (b<it.b) {it.b=b;}
                    if (a>it.a) {it.a=a;}
                }
            }
        }
    }
    record(a,b,D) {
        if (a>0 & a>this.minX & a<this.maxX & a< width-offset) {
            let y = this.fctY(a,D);
            if (y>offset) sites.push( new Vector(a,y,0));
        }
        if (b>0 & b>this.minX & b<this.maxX & b<width)
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
                stroke(80);
                for (let it of this.inter) {
                    if (x>it.a & x<it.b) stroke(255);
                }
                let y = D - p/2 - Math.pow(x - this.f.x(), 2) / 2 / p;
                if (y>= offset & y<=(height-offset)) point(x,y);
            }
        }
    }
}

class Germe {
    constructor(pt) {
        this.pt = pt;
        this.P = new Parabole(pt);
        this.etat = 0;
    }

    reset() {
        this.P.reset();
        this.etat = 0;
    }

    update(a,b) {
        if (a>offset) this.P.update(a,c);
        if (b>offset) this.P.update(b,d);
    }

    intersection(g,D) {
        let [a,b] = this.P.intersection(g.pt,D);
        let c = this.P.fctY(a,D);
        let d = this.P.fctY(b,D);
        return [a,b,c,d];

    }
    draw() {
        fill(255);stroke(255);
        circle(this.pt.x(), this.pt.y(),5);
    }
    show(D) {
        fill(255,100);noStroke();
        if (this.etat == -1) fill(255,0,0);
        if (this.etat == 1) fill(0,0,255);
        circle(this.pt.x(), this.pt.y(),2);
        if (D > this.pt.y()) {
            this.P.show(D);
        }

    }
}

class Voronoi {
    constructor() {
        this.germes = [];
        this.germesCurrent = [];
        this.startListe = [];
        this.restListe = [];
        this.gRest = [];
        sites = [];
    }

    add(g) {
        this.germes.push(g);
        this.germes.sort((a,b)=>{return a.pt.y() - b.pt.y() ; })
        this.startListe.push(g);
        this.startListe.sort((a,b)=>{return a.pt.y() - b.pt.y() ; })
    }

    reset() {
        for (let g of this.germes) {
            g.reset();
        }
    }
    update(D) {
        // this.germes.sort((a,b)=>{return b.pt.y() - a.pt.y() ; })
        this.startListe = [];
        this.reset();
        for (let g of this.germes) {
            if (g.pt.y()<D & g.etat>=0) {
                this.startListe.push(g);
                g.etat=1;
            }
        }
        this.startListe.sort((a,b)=>{return a.pt.y() - b.pt.y() ; })
        for (let i=0;i<this.startListe.length-1; i++) {
            let g = this.startListe[i];
            if (g.pt.y()<D) {
                for (let j=i+1; j<this.startListe.length;j++) {
                    let h = this.startListe[j];
                    let [a,b,c,d] = g.intersection(h,D);
                    if (a>b) {
                        g.P.update(b,a,true);
                        h.P.update(b,a,false);
                    } else {
                       g.P.update(a,b,true);
                       h.P.update(a,b,false);
                    }
                    if (g.P.inter.length == 0) { 
                        g.etat=-1;
                        g.P.on = false;
                    } else {
                        // if ( a>offset & a<(width-offset)) {
                        //     if (c>offset & c<(height-offset)) sites.push(new Vector(a,c,0));
                        // }
                        // if ( b>offset & b<(width-offset)) {
                        //     if (d>offset & d<(height-offset)) sites.push(new Vector(b,d,0));
                        // }
                    }
                }
            }
        }
        let pt = [];
        for (let g of this.startListe) {
            if (g.etat==1) {
                for (let it of g.P.inter) {
                    if ( ! pt.some((a)=>{return a.x==it.a})) {
                        if (it.a!=offset & it.a!=(width-offset) ) {
                            let y= g.P.fctY(it.a,D);
                            if (y>offset & y<(height-offset)) pt.push({x:it.a, y:y});
                        }
                    }
                    if ( ! pt.some((a)=>{return a.x==it.b})) {
                        if (it.b!=offset & it.b!=(width-offset) ) {
                            let y= g.P.fctY(it.b,D);
                            if (y>offset & y<(height-offset)) pt.push({x:it.b, y:y});
                        }
                    }
                }
            }
        }
        for (let p of pt) {
            if ( ! sites.some((a)=>{return ((Math.abs(a.e[0]-p.x)<0.5) & (Math.abs((a.e[1])-p.y)<0.5) ) })) {
                sites.push(new Vector(p.x, p.y,0));
            }
        }
        if (pt.length>2) {
            console.log('try',pt)
            
        }
    }
    getGermes(D) {
        for (let i=this.startListe.length-1;i>=0;i--) {
            let g = this.startListe[i];
            if (g.pt.e[1]<D) {
                this.germesCurrent.push(g);
                this.startListe.splice(i,1);
            }
        }

        for (let i=this.germesCurrent.length-1;i>=0;i--) {
            let g = this.germesCurrent[i];
            if ((this.restListe.indexOf(g) != -1) & (this.gRest.indexOf(g) == -1)) {
                this.germesCurrent.splice(i,1);
            }
        }
        // console.log(this.restListe)
    }
    balayage(D) {
        points = [];
        this.getGermes(D);
        this.gRest = [];
        for (let x = offset; x<(width-offset);x++) {
            points.push([]);
            let p = points[x-offset];
            for (let g of this.germesCurrent) {
                let y = g.P.fctY(x,D);
                if (y<=D && y>=offset) {
                    let v = new Vector(x,y,0);
                    p.push({v:v,g:g, c:color(51)});
                }
            }
            if (p.length>0) {
                p.sort((a,b)=>{return (b.v.e[1] - a.v.e[1]);});
                p[0].c = color(255);
                if (p.length>1) {
                    if ( (p[0].v.e[1] - p[1].v.e[1]) < 0.1 ) {
                        sites.push(p[0].v);
                    }
                }
                if (this.gRest.indexOf(p[0].g) == -1) {
                    this.gRest.push(p[0].g);
                }
            }
        }
        for (let g of this.gRest) {
            if (this.germesCurrent.indexOf(g) != -1) {
                if (this.restListe.indexOf(g) == -1) {
                    this.restListe.push(g);
                }
            }
        }
    }

    showEtat(D) {
        for (let g of this.germes) {
            g.show(D);
        }
    }

    draw() {
        noFill(); strokeWeight(1);
        for (let pt of points) {
            let l = pt.length;
            if (l>0) {
                let p = pt[0];
                stroke(p.c); //console.log(p.c.levels[0]);
                // if (l>1) {
                //     let p2 = pt[1];
                //     if ( (p.v.e[1] - p2.v.e[1]) < 0.1 ) {
                //         sites.push(p.v);
                //     }
                // }
                point(p.v.x(),p.v.y());
            }
            // for (let p of pt) {
            //     if (p) {
            //         stroke(p.c); //console.log(p.c.levels[0]);
            //         point(p.v.x(),p.v.y());
            //     }
            // }
        }
    }
    germesShow() {
        for (let g of this.germes) {
            g.draw();
        }        
    }
    show() {
        noFill(); stroke(255,0,0); strokeWeight(1);
        for (let v of sites) {
            point(v.x(),v.y());
        }
    }
}
