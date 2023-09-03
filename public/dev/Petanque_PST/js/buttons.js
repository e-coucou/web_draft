class BtBase {
    constructor(txt,x,y,l) {
        this.txt = txt;
        this.x = x;
        this.y = y;
        this.l = l;
    }
    init() {
        this.lx = this.x+this.l;
        this.ly1 = this.y - 10;
        this.ly2 = this.y + 10;
    }
    redim(x_,y_,l_,) {
        this.x = x_;
        this.y = y_;
        this.l = l_;
        this.init();
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
    isIn(x_,y_) {
        if ( x_>(this.x-this.l/2) && x_<(this.x+this.l/2) && y_>this.ly1 && y_<this.ly2) {
            return true;
        } else { return false;}
    }
}
class Switch extends BtBase {
    constructor(txt,x,y,l_,r,mode,init_=false) {
        super(txt,x+l_/2,y,l_)
        this.r = r;
        this.mode = mode;
        this.on = init_;
        super.init();
    }
    isIn(x_, y_,mode_) {
        if (this.mode.includes(mode_)) {
            // if ( x_>this.x && x_<this.lx && y_>this.ly1 && y_<this.ly2) {
            //     return true;
            return (super.isIn(x_,y_));
            // } else { return false;}
        } else { return false;}
    }
    redim(x_,y_,l_,lx_) {
        super.redim(x_,y_,l_,l_);
    }
    show(mode_) {
        if (this.mode.includes(mode_)) {
            textSize(12);
            textStyle(NORMAL);
            textAlign(CENTER,CENTER);
            fill(color(couleur.bg));
            rect(this.x-this.l/2,this.y-10,this.l-20,20);
            circle(this.x-this.l/2,this.y,20);
            circle(this.x+this.l/2-20,this.y,20);
            fill(color(couleur.f));
            rect(this.x+this.l/2-2.2*this.r,this.y-this.r/2,1.1*this.r+2,this.r);
            circle(this.x+this.l/2-2.2*this.r,this.y,this.r+2);
            circle(this.x+this.l/2-this.r,this.y,this.r+2);
            fill(255);
            textAlign(LEFT,CENTER);
            if (this.on) {
                text(this.txt,this.x-this.l/2,this.y);
                fill(color(couleur.cur));
                circle(this.x+this.l/2-this.r,this.y,this.r);
            } else {
                text(this.txt,this.x-this.l/2,this.y);
                fill(color(couleur.bk));
                circle(this.x+this.l/2-2.2*this.r,this.y,this.r);
            }        
        }
    }
}

class Bouton extends BtBase{
    constructor(txt,x,y,l_,mode,init_=false) {
        super(txt,x,y,l_);
        this.mode = mode;
        this.on = init_;
        super.init(l_/2);
    }
    isIn(x_, y_,mode_) {
        if (this.mode.includes(mode_)) {
            return (super.isIn(x_,y_));
        } else { return false;}
    }
    redim(x_,y_,l_) {
        super.redim(x_,y_,l_);
    }
    show(mode_) {
        if (this.mode.includes(mode_)) {
            textAlign(CENTER,CENTER);
            textSize(12);
            textStyle(NORMAL);
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