function rainbow(frequency,i,d) {
    let iter = (i % 127) + d%10;
        r = Math.floor(Math.sin(frequency*iter + 0) * (127) + 128);
        g = Math.floor(Math.sin(frequency*iter + 2) * (127) + 128);
        b = Math.floor(Math.sin(frequency*iter + 4) * (127) + 128);
    return color(r,g,b);
}

class Cercle {
    constructor(k, x ,y, l=0) {
        this.k = k;
        this.r = Math.abs(1/k);
        this.x = x;
        this.y = y;
        this.centre = new Complex(x,y);
        this.couleur=color(random(255),random(255),random(255));
        this.recur=false;
        this.level = l;
        this.nb = cercles.length-1;
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
        if (this.recur) return false;
        let d = dist(this.centre.re,this.centre.im,x,y);
        return (d<=this.r);
    }

    show() {
        if (!this.recur) {
            this.couleur = rainbow(100000,this.nb,1);
        }
        fill(this.couleur);
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