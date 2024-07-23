function clearButtons() {
    btTournoi.setOff(),btInfo.setOff();btGraphe.setOff();btListe.setOff();btZoom.setOff(),btFiltre.setOff();
}
function showButtons() {
    fill(color(couleur.txt));
    rect(padding,height-50,width-2*padding,50-padding);
    btTournoi.show(mode); //drawSW();
    btListe.show(mode);
    btGraphe.show(mode);
    // btRetour.show(mode);
    btInfo.show(mode);
    btNotice.show(mode);
    btELO.show(mode);
    btZoom.show(mode);
    btFiltre.show(mode);
    for (c of btAnnee) { c.show(mode); }
    // for (c of btCouleur) { c.show(mode); }
    // for (c of btPM) { c.show(mode); }
    for (c of btNav) { c.show(mode); }
    for (c of btCategories) { c.show(mode);}
    for (c of btPhase) { c.show(mode);}
}
function redimButtons() {
    let left, right,center;
    let r = 18;
    center = width/2;
    right = 3*(width-padding)/4;
    left = padding + r/2;

    let y = height-r-padding;
    let l = (width-4*padding)/4;
    l = (width-padding)/4;
    // btRetour.redim(center,y,l);
    let inc=1.5;
    btTournoi.redim(width*(1+0*inc)/10,y,r);
    btListe.redim(width*(1+1*inc)/10,y,r);
    btGraphe.redim(width*(1+2*inc)/10,y,r);
    btInfo.redim(width*(1+3*inc)/10,y,r);
    btZoom.redim(width*(1+4*inc)/10,y,r);
    btNotice.redim(width/3,20,width/3-2);
    btELO.redim(2*width/3,20,width/3-2);
    btELO.setH(12); btNotice.setH(12);
    let dy = 20;
    l = (width - 2* padding) / 3;
    let x = r;
    y = 40;
    for ( b of btCategories) {
        b.redim(x,y,l-padding);
        x += l;
    }
    btNav[0].redim(width*8.5/10,height-r-padding-3,14);
    btNav[1].redim(width*9.5/10,height-r-padding-3,14);
    btFiltre.redim(width*8.5/10,height-r-padding-3,14);
    dx = (width-2*padding)/annees.length;
    for (let i in annees) {
        i = int(i);
        btAnnee[i].redim((i+0.5)*dx+padding,padding+r/2,dx-4);
    }
    y=40;
    btPhase[0].redim(l/2+padding,y,l-4);
    btPhase[1].redim(width/2,y,l-4);
    btPhase[2].redim(width-l/2-padding,y,l-4);

    btPoule[0].redim(width/3,67,width/3-2);
    btPoule[1].redim(2*width/3,67,width/3-2);
}
function createButtons() {
    let left, right,center;
    let r = 18;
    center = width/2;
    right = 3*(width-padding)/4;
    left = padding + r/2;

    let y = height-r-padding;
    let l = (width-4*padding)/4;
    // btTournoi = new Switch('Tournoi',right,y,l,r,[0,1,3],true);
    btTournoi = new BoutonC('🏆',width*1/10,height-r-padding,r,[0,1,2,3,4,5],true); btTournoi.setH(14);
    btGraphe = new BoutonC('📈',width*4/10,height-r-padding,r,[0,1,2,3,4,5],false); btGraphe.setH(14);
    btListe = new BoutonC('🗄️',width*2.5/10,height-r-padding,r,[0,1,2,3,4,5],false); btListe.setH(14);
    btZoom = new BoutonC('🔍',width*7/10,height-r-padding,r,[0,1,2,3,4,5],false); btZoom.setH(14);
    l = (width-padding)/4;
    // btRetour = new Bouton('Retour ⏎',center,y,l,[4],true);
    btInfo = new BoutonC('⚙️',width*5.5/10,y,r,[0,1,2,3,4,5]);btInfo.setH(14);
    btNotice = new Bouton('Notice',width/3,20,width/3-2,[4,5],false);
    btELO = new Bouton('ELO explication !',2*width/3,20,width/3-2,[4,5],false);
    btELO.setH(12); btNotice.setH(12);
    for (let c=0;c<couleur_arr.length;c++) {
        btCouleur.push(new BoutonC('',100,100,20,[5],false));
    }
    let dy = 20;
    for (let b=0;b<8;b++) {
        btPM.push(new BoutonC('🔼',width-4*10,80+(b*dy),12,[4],false));
        btPM.push(new BoutonC('🔽',width-2*10,80+(b*dy),12,[4],false));
    }
    l = (width - 2* padding) / 3;
    let x = r;
    y = 40;
    for (let p of selCat) {
        if ( (p.id & categories) == p.id ) {
            btCategories.push(new Switch(p.cat,x,y,l-padding,r,[0,3],true));
        }
        x += l;
    }
    // inter = int((height-120)/initJoueurs.length);
    btNav.push(new BoutonC('◀️',width*8/10,height-r-padding,14,[2,4,5],false));
    btNav.push(new BoutonC('▶️',width*9/10,height-r-padding,14,[0,2,3,4,5],false));
    btFiltre = new BoutonC('🌐',width*8/10,height-r-padding,14,[0,3],false);
    dx = (width-2*padding)/annees.length;
    for (let i in annees) {
        i = int(i);
        a = annees[i];
        btAnnee.push(new Bouton(a.a,(i+0.5)*dx+padding,padding+r/2,dx-4,[0,1,3],false));
    }
    y=40;
    btPhase.push( new Bouton(t_json[0].type+iconPhase[0],l/2+padding,y,l-4,[1]));
    btPhase.push( new Bouton(t_json[1].type+iconPhase[1],width/2,y,l-4,[1]));
    btPhase.push( new Bouton(t_json[2].type+iconPhase[2],width-l/2-padding,y,l-4,[1],true));

    btPoule.push(new Bouton("Gassin",width/3,67,width/3-2,[1],true));
    btPoule.push(new Bouton("Ramatuelle",2*width/3,67,width/3-2,[1]));
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
        this.hh = 1.7 * this.h;
        this.x0 = this.x-this.l; this.y0=this.ly1;this.w0 = 2 * this.l; this.h0= this.ly2-this.ly1;
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
                rect(this.x-this.l/2 , this.y-this.h , this.l , 2 * this.h , this.hh);
                fill(color(couleur.bk));
                text(this.txt,this.x,this.y);
                // circle(this.x+this.l-this.r,this.y,this.r);
            } else {
                fill(color(couleur.bk));
                rect(this.x-this.l/2 , this.y-this.h , this.l , 2*this.h , this.hh);
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
        this.init();
    }
    init() {
        super.init();
        this.x0 = this.x-this.hh; this.w0 = 2 * this.hh; this.y0=this.y-this.hh ;this.h0=2*this.hh;
    }
    isIn(x_, y_,mode_) {
        if (this.mode.includes(mode_)) {
            if ( x_>(this.x0) && x_<(this.x+this.h0) && y_>this.y0 && y_<(this.y0+this.h0)) {
                // return (super.isIn(x_,y_));
                return true; } else { return false;}
        } else { return false;}
    }
    show(mode_) {
        if (this.mode.includes(mode_)) {
            textAlign(CENTER,CENTER);
            textSize(2*this.l);
            textStyle(NORMAL);
            if (this.on) {
                fill(color(couleur.sel));
                // circle(this.x,this.y,this.hh*2-2);
                rect(this.x0,this.y0,this.w0,this.h0);
                // rect(this.x-this.hh,this.y-this.hh,2*this.hh,2*this.hh);
                text(this.txt,this.x,this.y);
            } else {
                fill(color(couleur.bk));
                text(this.txt,this.x,this.y);
            }        
        }
    }
}