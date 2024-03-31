let couleur = ['#00ffff','#0000ff','#ff00ff','#00ff00','#cc00ff','#ffffcc','#00ffff','#00ffff','#00ffff']
class Polygone {
    constructor(n, r, c) {
        this.n = n;
        this.r = r;
        this.c = c;
        this.points = [];
        this.init();
    }

    init() {
        let incA = TWO_PI / this.n;
        let a = -PI/2;
        for (let i=0;i<this.n;i++) {
            let x = this.r*Math.cos(a) + this.c.x;
            let y = this.r*Math.sin(a) + this.c.y;
            a += incA;
            let pos = new createVector(x,y);
            this.points.push(new iPoint ( pos, couleur[i]) );
        }
    }

    show() {
        for (let p of this.points) {
            p.show(10);
        }
    }
}

class iPoint {
    constructor(pos,c) {
        this.pos=pos;
        this.couleur = c;
    }

    show(s=1) {
        stroke(this.couleur);
        noFill();
        strokeWeight(s);
        point(this.pos.x,this.pos.y);
    }
}