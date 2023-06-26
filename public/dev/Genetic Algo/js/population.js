class Population {
    constructor(n_,cible_) {
        this.cible = cible_;
        this.n = n_;
        this.population = [];
        this.mutable=[];
        this.trouve=false;
        this.solution;
        this.maxScore=0;

        let l_ = this.cible.length;
        for (let i=0; i<n_ ; i++) {
            this.population.push(new DNA(l_));
        }
    }

    fitness() {
        let f=0;
        let scores=[];
        this.mutable = [];
        for (let p of this.population) {
            let f = p.fitness(this.cible);
            scores.push(f);
            if (f>=1) {
                console.log('TROUVE');
                this.trouve=true;
                this.maxScore=f;
                this.solution=p;
                return true;
            }
            // f = floor(f*10000);
            // for (let i=0;i<f;i++) {
            //     this.mutable.push(p);
            // }
        }
        this.maxScore = max(scores);
        return false;
    }

    evolution(m_=0) {
        for (let i=0; i<this.n;i++) {
            // let ptA = random(this.mutable);
            // let ptB = random(this.mutable);
            let ptA = this.accept();
            let ptB = this.accept();
            this.population[i].genes = ptA.cross(ptB).slice(); //newGenes.slice();
            this.population[i].mutation(m_);
        }
    }

    accept() {
        let watchdog =0;
        while (true) {
            let id = floor(random(this.n));
            let p = random(this.maxScore);
            let pt = this.population[id];
            if (p<pt.score) {
                return pt;
            }
            watchdog++;
            if (watchdog>10000) { return null; }
        }
    }

    show(n_) {
        for (let i=0; i<n_ ; i++) {
            let y = (i+1)*32;
            this.population[i].show(y);
        }
    }
}