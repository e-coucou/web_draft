
function createButtons() {
    let left, right,center;
    let r = 18;
    center = width/2;
    right = 3*(width-padding)/4;
    left = padding + r/2;

    let y = height-r-padding;
    let l = (width-4*padding)/4;
    btTournoi = new Switch('Tournoi',right,y,l,r,[0,1,3],true);
    btGraphe = new Switch('Graphe',left,y,l,r,[0,3]);
    l = (width-padding)/4;
    btRetour = new Bouton('Retour ⏎',center,y,l,[4],true);
    btInfo = new BoutonC('⚙️',center,y,r,[0,1]);
    btNotice = new Bouton('Notice ...',left,30,width/2,[4],false);
    btELO = new Bouton('ELO explication !',right,70,width/2,[4],false);
    btELO.setH(14); btNotice.setH(14);
    for (let c=0;c<couleur_arr.length;c++) {
        btCouleur.push(new BoutonC('B',100,100,20,[4],true));
    }
    let dy = 20;
    for (let b=0;b<8;b++) {
        btPM.push(new BoutonC('🔼',width*9.7/10,100+(b*dy),7,[4],true));
        btPM.push(new BoutonC('🔽',width*9/10,100+(b*dy),7,[4],true));
    }
    let dx = (width - 2* padding) / 3;
    let x = r;
    y = 40;
    for (let p of selCat) {
        if ( (p.id & categories) == p.id ) {
            btCategories.push(new Switch(p.cat,x,y,dx-padding,r,[0,3],true));
        }
        x += dx;
    }
    inter = int((height-120)/initJoueurs.length);
    btNav.push(new BoutonC('◀️',left,height-7-padding,14,[2],true));
    btNav.push(new BoutonC('⤴️',center,height-7-padding,14,[2],true));
    btNav.push(new BoutonC('▶️',right,height-7-padding,14,[2],true));
    dx = (width-2*padding)/annees.length;
    for (let i in annees) {
        i = int(i);
        a = annees[i];
        btAnnee.push(new Bouton(a.a,(i+0.5)*dx+padding,padding+r/2,dx-4,[0,1,3],false));
    }

}
class BtBase {
    constructor(txt,x,y,l) {
        this.txt = txt;
        this.x = x;
        this.y = y;
        this.l = l;
        this.h = 10;
    }
    init() {
        this.lx = this.x+this.l/2;
        this.ly1 = this.y - this.h;
        this.ly2 = this.y + this.h;
        this.hh = 2 * this.h;
    }
    setH(h_) {
        this.h = h_;
        this.init();
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
    redim(x_,y_,l_) {
        super.redim(x_+l_/2,y_,l_);
    }
    show(mode_) {
        if (this.mode.includes(mode_)) {
            textSize(this.h*1.2);
            textStyle(NORMAL);
            textAlign(CENTER,CENTER);
            fill(color(couleur.bk));
            rect(this.x-this.l/2,this.y-11,this.l-20,22 );
            circle(this.x-this.l/2,this.y,22);
            circle(this.x+this.l/2-20,this.y,22);
            fill(color(couleur.cur));
            rect(this.x+this.l/2-2.2*this.r , this.y-this.r/2 -1 , 1.1*this.r+2 , this.r+2);
            circle(this.x+this.l/2-2.2*this.r,this.y,this.r+2);
            circle(this.x+this.l/2-this.r-2 , this.y ,this.r+2);
            fill(255);
            textAlign(LEFT,CENTER);
            if (this.on) {
                text(this.txt,this.x-this.l/2,this.y);
                fill(color(couleur.sel));
                circle(this.x+this.l/2-this.r-3,this.y,this.r);
            } else {
                text(this.txt,this.x-this.l/2,this.y);
                fill(color(couleur.dm));
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
        super.init();
    }
    isIn(x_, y_,mode_) {
        if (this.mode.includes(mode_)) {
            return (super.isIn(x_,y_));
        } else { return false;}
    }
    show(mode_) {
        if (this.mode.includes(mode_)) {
            textAlign(CENTER,CENTER);
            textSize(this.h*1.2);
            textStyle(NORMAL);
            if (this.on) {
                fill(color(couleur.sel));
                rect(this.x-this.l/2 , this.y-this.h , this.l , this.hh , this.hh);
                fill(color(couleur.bk));
                text(this.txt,this.x,this.y);
                // circle(this.x+this.l-this.r,this.y,this.r);
            } else {
                fill(color(couleur.bk));
                rect(this.x-this.l/2,this.y-this.h,this.l,this.hh, this.hh);
                fill(color(couleur.sel)); fill(255);
                text(this.txt,this.x,this.y);
            }        
        }
    }
}

class BoutonC extends BtBase {
    constructor(txt,x,y,l_,mode,init_=false) {
        super(txt,x,y,l_);
        this.mode = mode;
        this.on = init_;
        super.init();
    }
    isIn(x_, y_,mode_) {
        if (this.mode.includes(mode_)) {
            return (super.isIn(x_,y_));
        } else { return false;}
    }
    show(mode_) {
        if (this.mode.includes(mode_)) {
            textAlign(CENTER,CENTER);
            textSize(2*this.l);
            textStyle(NORMAL);
            if (this.on) {
                fill(color(couleur.bk));
                text(this.txt,this.x,this.y);
                // circle(this.x+this.l-this.r,this.y,this.r);
            } else {
                fill(color(couleur.sel));
                text(this.txt,this.x,this.y);
                // circle(this.x+this.l-this.r,this.y,this.r);
            }        
        }
    }
}