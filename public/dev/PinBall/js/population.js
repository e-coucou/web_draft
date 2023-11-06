class Population {
    constructor(n_) {
        this.particules = [];
        this.maxM = 10;
        this.minM = 2;
        this.grille = new Grille(2/scale);
        this.start(n_);
    }
    start(n_) {
        for (let i=0; i<n_ ; i++) {
            const couleur = color(random(255),random(255),random(255));
            this.particules.push(new Particule(random(simW),random(simH),couleur,random(this.minM,this.maxM)));
            this.particules[i].setVelocite(new Vector2(random(-10,10), random(-10,10)));
        }
        this.grille.initLookup(this.particules);
    }

    canon(p,v,c) {
        this.particules.push(new Particule(p.x,p.y,c,2));
        this.particules[this.particules.length-1].setVelocite(v);
    }

    collision() {
        for (let p of this.particules) {
            let [voisins,_] = this.grille.lookupPoint(p.pos,this.particules);
            p.collision(voisins,this.particules);
            this.path.push({p:p.pos.copy(), v:p.vel.copy(), a:p.posPrev.copy()});
        }
    }

    update() {
        const subStep = 12;
        const dtS = dt/subStep;
        this.path = [];
        for (let i=0; i<subStep; i++) {
            for (let p of this.particules) {
                // this.path.push({p:p.pos.copy(), v:p.vel.copy(), a:p.posPrev.copy()});
                p.updPos(dtS);
                // this.path.push({p:p.pos.copy(), v:p.vel.copy(), a:p.posPrev.copy()});
            }
            this.grille.initLookup(this.particules);
            this.collision();
            for (let p of this.particules) {
                p.updVel(dtS);
                // this.path.push({p:p.pos.copy(), v:p.vel.copy(), a:p.posPrev.copy()});
                p.edge(dtS);
                // this.path.push({p:p.pos.copy(), v:p.vel.copy(), a:p.posPrev.copy()});
            }
        }
        for (let p of this.particules) {
            p.show();
        }
    }

    debug() {
        noFill();
        strokeWeight(1);
        for (let p of this.path) {
            stroke(255);
            let x = cX(p.p.x), y = cY(p.p.y);
            circle(x, y, 100);
            stroke(255,0,0);
            let dx = (p.v.x)*10, dy = (p.v.y)*10;
            line(x,y,x+dx, y-dy);
        }
        stroke(255,120);
        line(0,cY(1.3),width,cY(1.3));
    }

    edge() {
        noFill();
        strokeWeight(1);
        stroke(255,120);
        line(0,cY(4),width,cY(4));
        line(cX(4.7),0,cX(4.7),height);
        line(cX(simW-9.1),0,cX(simW - 9.1),height);
    }

    show() {
        for (let p of this.particules) {
            p.color = color(255,0,0);
        }
        this.grille.show(this.particules);
    }
}


class Edge {
    constructor(a,b) {
        this.p0 = a;
        this.p1 = b;
    }
    // determiner la distance par rapport au segment [a,b]
    
}