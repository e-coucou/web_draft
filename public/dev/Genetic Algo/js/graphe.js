class Graphe {
    constructor(x_,y_,w_,h_,) {
        this.pos = createVector(x_,y_);
        this.w = w_;
        this.h = h_;
        this.bkColor = color(6, 77, 38);

        this.courbes = [];
    }

    nouvelle(c_) {
        this.courbes.push(new Courbe(this.pos, c_));
    }

    ajoute(c_, v_) {
        this.courbes[c_].ajoute(v_);
    }

    show() {
        fill(this.bkColor);
        rect(this.pos.x, this.pos.y, this.w, this.h);
        for (let c of this.courbes) {
            c.show(this.w,this.h);
        }
    }
}


class Courbe {
    constructor(pos_, c_) {
        this.pos = pos_;
        this.valeurs = [];
        this.max = 0;
        if (c_) {
            this.couleur = c_;
        } else {this.couleur = color(255,255,255);
        }
    }

    ajoute(v_) {
        if (v_>this.max) this.max = v_;
        this.valeurs.push(v_);
    }

    show(w_,h_) {
        stroke(this.couleur);
        strokeWeight(1);
        let n = this.valeurs.length;
        let inc = w_/n;
        let ech = h_/this.max;
        let x = 0;
        noFill();
        beginShape();
        for (let v of this.valeurs) {
            let y = map(v, 0, 1, h_, 0);
            vertex(this.pos.x + x, this.pos.y+y);
            x += inc;
        }
        endShape();
    }
}