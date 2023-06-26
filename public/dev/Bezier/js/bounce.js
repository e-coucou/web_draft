class Bounce {
    constructor(x, y, a = 1) {
        this.x = x;
        this.y = y;
        this.ancre = a;
        this.fige=0;
        this.vx = random(-1,1);
        this.vy = random(-1,1);
    }
    update() {
        if (this.ancre !=1 && this.fige==0 ) {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x<0 || this.x > width) {
                this.vx *= -1;
            }
            if (this.y<0 || this.y > height) {
                this.vy *= -1;
            }
        }
    }

    show() {
        if (this.ancre ==1) {
            stroke(10,255,255);
            strokeWeight(12);
        } else {
            stroke(255,255,255);
            strokeWeight(8);
        }
        point(this.x, this.y);
    }
}
