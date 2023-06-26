class Emetteur {
    constructor(_x, _y) {
        this.pos = createVector(_x, _y);
        this.particules = [];
        this.life = 255;
    }

    emet(nb) {
        for (let i = 0; i < nb; i++) {
            this.particules.push(new Particule(this.pos.x, this.pos.y));
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
        return (this.life > 0);
    }

    show() {
        if (this.life > 200) {
            const couleur = color('hsba(' + 360 * this.life / 255 + ', 100%, 100%, ' + (this.life % 2 === 0) ? 255 : 120 + ')');
            fill(couleur);
            circle(this.pos.x, this.pos.y, 4);
        }
        for (let p of this.particules) {
            p.show();
        }
    }
}