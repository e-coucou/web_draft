class Population {
    constructor(n_) {
        this.particules = [];
        this.maxM = 10;
        this.minM = 2;
        this.grille = new Grille(this.maxM/scale);
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
        this.particules.push(new Particule(p.x,p.y,c,4));
        this.particules[this.particules.length-1].setVelocite(v);
    }

    collision() {
        for (let p of this.particules) {
            let [voisins,_] = this.grille.lookupPoint(p.pos,this.particules);
            p.collision(voisins,this.particules);
        }
    }

    update() {
        const subStep = 4;
        const dtS = dt/subStep;
        for (let i=0; i<subStep; i++) {
            for (let p of this.particules) {
                p.edge(1);
                p.updPos(dtS);
                // p.update();
            }
            this.grille.initLookup(this.particules);
            this.collision();
            for (let p of this.particules) {
                p.updVel(dtS);
            }
        }
        for (let p of this.particules) {
            p.show();
        }
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
}