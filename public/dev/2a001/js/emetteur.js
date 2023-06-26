class Emetteur {
    constructor(_x,_y) {
        this.pos=createVector(_x,_y);
        this.particules = [];
        this.life = 255;
    }

    emet(nb) {
        for(let i=0;i<nb;i++) {
            this.particules.push(new Particule(this.pos.x,this.pos.y));
        }
    }

    update() {
        for (let p of this.particules) {
            p.applyForce(gravity);
            p.update();
        }
        this.particules = this.particules.filter(p => p.isAlive());
        this.life -= 1;
    }

    isAlive() {
        return (this.life>0);
    }

    show() {
        for (let p of this.particules) {
            p.show();
        }
    }
}