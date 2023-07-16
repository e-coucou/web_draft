class GA {
    constructor(t_) {
        this.Total = t_;
        this.birds = [];
        this.saved = [];
        this.score = 0;
        this.maxScore=0;
        this.bestBird= null;
        this.gen = 1;
        for (let i=0; i<this.Total; i++) {
            this.birds.push(new Bird());
        }    
    }

    update() {
        for (let i=this.birds.length-1; i>=0 ; i--) {
            let bird = this.birds[i];
            this.score++;
            bird.update();
            let life = bird.collision(pipes);
            bird.play(pipes);
            if (!life) {
                this.supp(i);
            }
        }
        if (this.birds.length == 0) {
            this.nextGen();
            return true;
        }
        return false;
    }
    show() {
        for (let b of this.birds) {
            b.show();
        }
    }
    nextGen() {
        this.gen++;
        console.log(this.gen);
        this.Fitness();

        let pick = this.pickOne();
        // this.birds = [];
        for (let i=0; i<this.Total; i++) {
            this.birds.push(this.pickOne());
        }
        this.score=0;
        this.saved = [];
        pipes = [];
        pipes.push(new Pipe());
    }

    pickOne() {
        let idx = this.saved.length-1;
        let r = random(1);

        while (r>0) {
            // console.log(idx);
            r = r - this.saved[idx].fitness;
            idx--;
        }
        idx++;
        let pick = this.saved[idx];
        let brain = pick.brain.copy();
        let child = new Bird(brain);
        child.mutate(0.1);
        return child;
    }

    supp(i_) {
        this.saved.push(this.birds.splice(i_,1)[0]);
    }

    Fitness() {
        this.maxScore=0;
        for (let bird of this.saved) {
            bird.fitness = bird.score / this.score;
            if (bird.score>this.maxScore) {
                this.maxScore = bird.score;
                this.bestBird = bird.brain.copy();
            }
        }
    }
}