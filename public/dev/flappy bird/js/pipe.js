class Pipe {
    constructor() {
        this.trou = random(height/6, height/2);
        this.top = random(height/2);
        this.bottom = height - (this.top+this.trou);
        this.x = width;
        this.w= 40;
        this.speed = -3;
        this.couleur_b = color(255);
        this.couleur_t = color(255);
    }

    setDefaut() {
        this.couleur_b = color(255);
        this.couleur_t = color(255);
    }

    setProche() {
        this.couleur_b = color(0,255,255);
        this.couleur_t = color(0,255,255);
    }

    setCollision(top_) {
        if (top_) {
            this.couleur_t = color(255,0,0);
        } else {
            this.couleur_b = color(255,0,0);
        }
    }

    update() {
        this.x += this.speed;
        return (this.x < -this.w);
    }

    show() {
        fill(this.couleur_t);
        rect(this.x,0, this.w,this.top);
        fill(this.couleur_b);
        rect(this.x,height - this.bottom, this.w, this.bottom);
    }
}