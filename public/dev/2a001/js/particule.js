class Particule {
    constructor(_x,_y) {
        this.pos = createVector(_x,_y);
        this.vel = p5.Vector.random2D();
        this.vel.mult(random(0.5,2));
        this.acc = createVector(0,0);
        this.r = 2;
        this.life = 255;
        this.color = 0;
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);

        this.life -= 4;
        this.color += 2;
    }

    applyForce(force) {
        this.acc.add(force);
    }

    isAlive() {
        return (this.life>0);
    }

    show() {
        noStroke();
        const couleur = color('hsba('+this.color+', 100%, 100%, '+this.life/255+')');
        fill(couleur);
        circle(this.pos.x,this.pos.y,this.r*2);
    }
}