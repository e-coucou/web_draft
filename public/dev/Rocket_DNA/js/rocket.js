class Rocket {
    constructor(DNA_) {
        this.pos = createVector(width/2, height);
        this.vel = createVector();
        // this.vel = p5.Vector.random2D();
        this.acc =createVector();
        this.couleur = color(255,120);
        if (DNA_) {
            this.DNA = DNA_;
        } else {
            this.DNA = new DNA(life);
        }
        this.fitness=0;
        this.out = false;
        this.ok = false;
    }

    update() {
        if (!this.ok && !this.out) {
            let d = dist(this.pos.x, this.pos.y, cible.x, cible.y);
            if (d < 10) {
                this.ok = true;
                this.fitness = 10;
                this.pos = cible.copy();
                this.couleur = color(0,0,170,180);
            }
            this.force(this.DNA.genes[cycle]);
            this.vel.add(this.acc);
            this.pos.add(this.vel);
            this.acc.mult(0);
        } 
    }
    edge() {
        if (!this.ok && !this.out) {
            if (this.pos.x<0 || this.pos.x >width || this.pos.y<0 || this.pos.y > height) {
                this.out = true;
                this.fitness /= 10;
                this.couleur = color(180,120,0,200);
            }
        }
    }

    force(force_) {
        this.acc.add(force_);
    }

    calcFitness() {
        if (!this.ok) {
            let d = dist(this.pos.x, this.pos.y, cible.x, cible.y);
            this.fitness = 1 / d;
        }
    }

    show() {
        rectMode(CENTER);
            push();
            noStroke();
            fill(this.couleur);
            translate(this.pos.x, this.pos.y);
            rotate(this.vel.heading());
            rect(0,0,25,5);
        pop();
    }

}

class Population {
    constructor(nb_) {
        this.rockets=[];
        for (let i=0; i<nbR ; i++) {
            this.rockets.push(new Rocket());
        }
        this.nextGen = [];
    }

    evaluation() {
        let maxFitness=0;
        for (let r of this.rockets) {
            r.calcFitness();
            if (r.fitness>maxFitness) {
                maxFitness=r.fitness;
            }
        }
        for (let r of this.rockets) {
            r.fitness /= maxFitness;
        }
        this.nextGen = [];
        for (let r of this.rockets) {
            let n = r.fitness*100;
            for (let j=0; j<n;j++) {
                this.nextGen.push(r);
            }
        }
    }

    selection() {
        let newRockets=[];
        for (let r of this.rockets) {
            let pM = random(this.nextGen).DNA;
            let pF = random(this.nextGen).DNA;

            let child = pM.crossOver(pF);
            newRockets.push(new Rocket(child));
        }
        this.rockets = newRockets;
    }

    run() {
        for (let r of this.rockets) {
            r.update();
            r.edge();
            r.show();
        }    
    }
}

class DNA {
    constructor(lifecycle,genes) {
        if (genes) {
            this.genes = genes;
        } else {
            this.genes=[];
            for (let i=0; i<lifecycle; i++) {
                this.genes.push(p5.Vector.random2D());
                this.genes[i].setMag(0.2);
            }
        }
    }

    crossOver(pF) {
        let newGene = [];
        let cut = floor(random(this.genes.length));
        for (let i=0; i<this.genes.length; i++) {
            if (i<cut) {
                newGene.push(this.genes[i]);
            } else {
                newGene.push(pF.genes[i]);
            }
        } 
        for (let i=0; i<this.genes.length; i++) {
            let r = random() * 1000;
            if (r<1) {
                newGene[i] = p5.Vector.random2D();
            }
        }
            return new DNA(life,newGene);
    }
}