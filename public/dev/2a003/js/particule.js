class Particule {
    constructor(_x, _y) {
        this.pos = createVector(_x, _y);
        this.vel = p5.Vector.fromAngle(random(0, PI));
        // this.vel = p5.Vector.random2D();
        this.vel.mult(random(0.5, 1.5));
        this.acc = createVector(0, 0);
        this.r = 1;
        this.color = 0;
        this.fixe = false;
        this.life = 255;
    }

    update() {
        if (!this.fixe) {
            this.vel.mult(0.99);

            this.vel.add(this.acc);
            this.pos.add(this.vel);
            this.acc.mult(0);
            this.life -= 2;
            this.color += 4;
        }
    }

    isAlive() {
        return (this.life > 0);
    }

    applyForce(force) {
        this.acc.add(force);
    }

    show() {
        noStroke();
        // const couleur = color('hsba('+this.color+', 100%, 100%,1)');
        const couleur = color('hsba(' + this.color + ', 100%, 100%, ' + this.life / 255 + ')');
        fill(couleur);
        circle(this.pos.x, this.pos.y, this.r * 2);
    }
}