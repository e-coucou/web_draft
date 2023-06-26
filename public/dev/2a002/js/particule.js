class Particule {
    constructor(_x,_y) {
        this.pos = createVector(_x,_y);
        this.vel = createVector(0,0)
        this.acc = createVector(0,0);
        this.r = 5;
        this.color = 155;
        this.fixe = false;
    }

    update() {
        if (!this.fixe) {
        this.vel.mult(0.99);

        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
        }
    }

    applyForce(force) {
        this.acc.add(force);
    }

    show() {
        noStroke();
        const couleur = color('hsba('+this.color+', 100%, 100%,1)');
        fill(couleur);
        circle(this.pos.x,this.pos.y,this.r*2);
    }
}