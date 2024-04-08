let couleurs = [];

function rainbow(frequency,i,d) {
    let iter = (i % 127) + d%10;
        r = Math.floor(Math.sin(frequency*iter + 0) * (127) + 128);
        g = Math.floor(Math.sin(frequency*iter + 2) * (127) + 128);
        b = Math.floor(Math.sin(frequency*iter + 4) * (127) + 128);
    return color(r,g,b);
}

function initCouleur() {
    for (let i=0;i<10;i++) {
        couleurs.push(rainbow(i,100,0));
    }
}

class PIe {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.v = 0;
        this.r = width*0.05;
        this.num = floor(random(10));
        this.offsetX = random()*100;
        this.couleur = couleurs[this.num];
    }

    update() {
        this.v += 0.05;
        this.y += this.v
        this.offsetX+=0.03;
        this.rot = noise(this.offsetX);
    }

    edge() {
        return (this.y>(height+this.r));
    }
    
    show() {
        ellipseMode(CENTER);
        textAlign(CENTER,CENTER);
        textSize(this.r);
        fill(255);
        stroke(0);
        const a = TWO_PI/9
        push();
        translate(this.x,this.y)
        rotate(this.rot);
        // circle(0,0,2*this.r);
        // fill(couleurs[this.num]);

        for (let s=0;s<this.num;s++) {
            let alpha = int(s/(this.num+1)*128 + 127);
            this.couleur.setAlpha(alpha);
            fill(this.couleur);
            arc(0,0,2*this.r, 2*this.r,a*s,(s+1)*a,PIE)
        }
        fill(0);
        text(this.num,0,0);
        pop();
    }
}


class Raquette {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.w = 100;
        this.h = 27;
    }

    update() {
        this.x = mouseX;
    }

    catch(pie) {
        if ((pie.y+pie.r)>=(this.y-this.h/2) && pie.x>(this.x-this.w/2) && pie.x<(this.x+this.w/2)) {
            return true;
        } else  return false;
    }

    show(val='') {
        rectMode(CENTER);
        fill('#3700B3'); noStroke();
        push();
        translate(this.x,this.y);
        rect(0,0,this.w,this.h,5);
        textAlign(CENTER,CENTER);
        textSize(this.h);
        fill('#63DAC5');
        text(val,0,0);
        pop();

    }
}