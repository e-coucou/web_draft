class Bird {
    constructor(brain_) {
        if (brain_ instanceof NeuralNetwork) {
            this.brain = new NeuralNetwork(brain_);
        } else {
            this.brain = new NeuralNetwork(5,8,2);
        }
        this.x = width/9;
        this.y = height/2;
        this.r = 60;
        this.gravity = 0.8;
        this.vel = 0;
        this.lift = 15;
        this.couleur = color(255,120);
        this.life = true;
        this.score = 0;
        this.fitness = 0;
    }

    update() {
        this.score++;
        this.vel += this.gravity;
        this.y += this.vel * 0.85;
        if (this.y>height - this.r/2) {
            this.y=height - this.r/2;
            this.vel = 0;
            // this.life = false; 
        }
        if (this.y<0) {
            this.y= this.r/2;
            this.vel = 0;
            this.life = false;
        }
    }

    play(pipes_) {
        // cherche le mur le plus proche
        let pipe_;
        let proche = Infinity;
        for (let p of pipes_) {
            p.setDefaut();
            let d = p.x - this.x + p.w;
            if ( d>=0 && d<proche) {
                proche = d;
                pipe_ = p;
            }
        }
        let inputs = [];
        pipe_.setProche();
        inputs[0] = this.y / height;
        inputs[1] = pipe_.top / height;
        inputs[2] = pipe_.bottom / height;
        inputs[3] = pipe_.x / width;
        inputs[4] = this.vel / 10.;
        let output = this.brain.predic(inputs);
        if (output[0] > output[1]) this.up();
    }

    mutate(v_) {
        this.brain.mutate(v_);
    }

    up() {
        this.vel -= this.lift;
    }

    collision(pipes_) {
        let danger = false;
        for (let p of pipes_) {
            if ((this.x>p.x) && (this.x <(p.x+p.w))) {
                danger = true;
                if ((this.y < p.top)) {
                    p.setCollision(true);
                    this.life = false;
                }
                if ((this.y > (p.top+p.trou))) {
                    p.setCollision(false);
                    this.life = false;
                }
            }
        }
        if (danger) {
            this.couleur = color(255,255,0);
        } else {
            this.couleur = color(255,120);
        }
        return this.life;
}

    show() {
        fill(this.couleur);
        texture(oiseau);
        textureMode(NORMAL);
        noStroke()
        strokeWeight(1);
        circle(this.x,this.y,this.r);
    }
}