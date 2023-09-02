class Switch {
    constructor(txt,x,y,l,r,mode,init_=false) {
        this.txt = txt;
        this.x = x;
        this.y = y;
        this.l = l;
        this.r = r;
        this.mode = mode;
        this.on = init_;
        this.lx = this.x + this.l;
        this.ly1 = this.y - 10;
        this.ly2 = this.y + 10;
    }
    setOn() {
        this.on = true;
    }
    setOff() {
        this.on = false;
    }
    setSW(callback,id_) {
        this.on = !(this.on);
        if (id_) {
            callback(id_);
        } else {
            callback();
        }
    }
    isIn(x_, y_,mode_) {
        if (this.mode.includes(mode_)) {
            if ( x_>this.x && x_<this.lx && y_>this.ly1 && y_<this.ly2) {
                return true;
            } else { return false;}
        } else { return false;}
    }
    show(mode_) {
        if (this.mode.includes(mode_)) {
            textAlign(CENTER,CENTER);
            fill(color(couleur.bg));
            rect(this.x,this.y-10,this.l-20,20);
            circle(this.x,this.y,20);
            circle(this.x+this.l-20,this.y,20);
            fill(color(couleur.f));
            rect(this.x+this.l-2.2*this.r,this.y-this.r/2,1.1*this.r+2,this.r);
            circle(this.x+this.l-2.2*this.r,this.y,this.r+2);
            circle(this.x+this.l-this.r,this.y,this.r+2);
            fill(255);
            textAlign(LEFT,CENTER);
            if (this.on) {
                text(this.txt,this.x,this.y);
                fill(color(couleur.cur));
                circle(this.x+this.l-this.r,this.y,this.r);
            } else {
                text(this.txt,this.x,this.y);
                fill(color(couleur.bk));
                circle(this.x+this.l-2.2*this.r,this.y,this.r);
            }        
        }
    }
}

class Bouton {
    constructor(txt,x,y,l,r,mode,init_=false) {
        this.txt = txt;
        this.x = x;
        this.y = y;
        this.l = l;
        this.r = r;
        this.mode = mode;
        this.on = init_;
        this.lx = x+this.l/2;
        this.ly1 = this.y - 10;
        this.ly2 = this.y + 10;
    }
    setOn() {
        this.on = true;
    }
    setOff() {
        this.on = false;
    }
    setSW(callback,id_) {
        this.on = !(this.on);
        if (id_) {
            callback(id_);
        } else {
            callback();
        }
    }
    isIn(x_, y_,mode_) {
        if (this.mode.includes(mode_)) {
            if ( x_>(this.x-this.l/2) && x_<this.lx && y_>this.ly1 && y_<this.ly2) {
                return true;
            } else { return false;}
        } else { return false;}
    }
    show(mode_) {
        if (this.mode.includes(mode_)) {
            textAlign(CENTER,CENTER);
            if (this.on) {
                fill(color(couleur.cur));
                rect(this.x-this.l/2,this.y-10,this.l,20);
                fill(color(couleur.bk));
                text(this.txt,this.x,this.y);
                // circle(this.x+this.l-this.r,this.y,this.r);
            } else {
                fill(color(couleur.bk));
                rect(this.x-this.l/2,this.y-10,this.l,20);
                fill(color(couleur.dm));
                text(this.txt,this.x,this.y);
            }        
        }
    }}