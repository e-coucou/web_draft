class Cercle {
    constructor(k, x ,y) {
        this.k = k;
        this.r = Math.abs(1/k);
        this.x = x;
        this.y = y;
        this.centre = new Complex(x,y);
        this.couleur=color(random(255),random(255),random(255));
        this.recur=false;
    }

    setRecur() {
        this.recur=true;
        this.couleur=color(255);
    }
    dist(o) {
        return dist(this.centre.re,this.centre.im,o.centre.re,o.centre.im);
        // return Math.sqrt()
    }

    in(x,y) {
        // let o = new Complex(x,y);
        let d = dist(this.centre.re,this.centre.im,x,y);
        return (d<=this.r);
    }

    show() {
        fill(this.couleur);
        // stroke(this.couleur);
        noStroke();
        strokeWeight(1);
        circle(this.centre.re,this.centre.im,this.r*2);
        if (!this.recur) {
            textAlign(CENTER,CENTER);
            textSize(this.r);
            fill(255);
            text('π',this.x,this.y);
        }
    }
}