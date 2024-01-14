let ctrl = false;
let FLAT = false;
let RAINBOW = false;

let searchInfo='';

function rainbow(frequency,i,d) {
    let iter = (i % 127) + d%10;
        r = Math.floor(Math.sin(frequency*iter + 0) * (127) + 128);
        g = Math.floor(Math.sin(frequency*iter + 2) * (127) + 128);
        b = Math.floor(Math.sin(frequency*iter + 4) * (127) + 128);
    return color(r,g,b);
}

// Gestion du clavier
function keyPressed() {
        if (ctrl & key=='b') { LOOP =  !LOOP }
        if (key==' ') { mouse_(); }
        if (key=='r') { reset(); }
        if (key=='l') { loop(); }
        if (key=='d') { DEBUG = ! DEBUG; loop(); }
        if (key=='v') { VERBOSE = ! VERBOSE; }
        if (keyCode == RIGHT_ARROW) { Annee.nextYear(); }
        if (keyCode == LEFT_ARROW) { Annee.prevYear(); }
        if (keyCode == UP_ARROW) { ListeVille.up();}
        if (keyCode == DOWN_ARROW) { ListeVille.down(); }
        if (key=='c') { colorie(); }
        if (key=='t') { tfVisualisation(); }
    // console.log(key,keyCode)
    ctrl = (keyCode == 91) || (keyCode == 17);
    // console.log(ctrl);
}

function mouse_() {
    // mouse clicked ...
    forward();
}
// function mouseClicked(event) {
//     mouse_();
// }

function mousePressed() {
    mouse_();
}

class Button {
    constructor(x,y,w,h) {
        this.x = x;
        this.y = y;
        this.h = h;
        this.w = w;
        this.value=false;
    }

    getOK(x,y) {
        return((x>this.x & x<(this.x+this.w) & y>this.y & y<(this.y+this.h)));
    }
    switch() {
        this.value = ! this.value;
    }
    click(x,y) {
        if (this.getOK(x,y)) {
            this.switch();
        }
    }
    couleur(v) {
        if (v>100) {
            let c=map(v,100,200,50,255);
            return color(c,0,0);
        } else {
            let c=map(v,0,100,50,255);
            return color(0,0,c);
        }
    }

    show() {
        rectMode(CORNER);
        let alpha=120;
        if (this.value) alpha=255;
        fill(255,0,0,alpha);
        rect(this.x,this.y,this.w/2,this.h);
        fill(0,0,255,alpha);
        rect(this.x+this.w/2,this.y,this.w/2,this.h);
    }
}

class barGraph {
    constructor(x,y,w,h,min_,max_) {
        this.x = x;
        this.y = y;
        this.h = h;
        this.w = w;
        this.min = min_;
        this.max = max_;
    }

    anim(v) {
        rectMode(CORNER);
        stroke(cVert);fill(0,0);
        rect(this.x,this.y,this.w,this.h,2);
        noStroke();fill(color(cVert));
        let w = v / (this.max-this.min) * (this.w-2);
        if (w>0.7*this.w) fill(255,0,0);
        rect(this.x+1,this.y+1,w,this.h-2)
    }
}

class LISTE {
    constructor(x,y,w,h,liste=[]) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.sel = 0;
        this.liste = liste;
        this.startL = 0;
        this.stopL = 0;
        this.NBMAX = int(h / 12);
        this.setMaxView(35);
        this.inc = min(this.h / this.nbView, 12);
    }

    setMaxView(n) {
        this.nbView = n;
        this.stopL = this.startL + n;
    }

    setListe(l) {
        this.liste = l;
        this.nbView = min(this.liste.length, this.NBMAX);
        // this.startL = 0;
        this.stopL = min(this.nbView+this.startL, this.liste.length);
        this.inc = min(this.h / this.nbView, 12);
        this.sel = this.contrainte(this.sel);
    }

    up() {
        if (this.startL!=0) {
            this.startL = max(0, this.startL-1);
        }
        this.sel = max(0,min(this.sel-1,this.stopL-1));
    }
    down() {
        if (this.sel==(this.stopL-1)) {
            this.stopL = min( this.stopL+1, this.liste.length-1);
            this.startL = max(0,this.stopL-this.nbView);
        }
            this.sel = min(this.sel +1, this.stopL-1) ;
    }

    contrainte(v) {
        return max(0, min(v , this.stopL-1) );
    }

    getSel(x,y) {
        let Ok = this.getOK(x,y);
        if (Ok) {
            this.sel = this.contrainte( this.startL + int((y - this.y) / this.inc));
        }
        return Ok;
    }

    getOK(x,y) {
        return ( x>this.x & x<(this.x+this.w) & y>this.y & y<(this.y+this.h) );
    }

    show() {
        if (this.liste.length>0) {
            rectMode(CORNER);
            textAlign(LEFT, CENTER);
            for (let i = this.startL; i<this.stopL; i++) {
                let p =this.liste[i];
                let x = this.x+25 ;
                let y = (i-this.startL) * this.inc + this.y;
                noStroke(); fill(cVert); textSize(10);
                if (p.info.data.sel >= 1) { fill(p.info.data.couleur) }
                if (i == this.sel) { fill(255) ; }
                text(this.liste[i].info.city,x,y);
                if (i==this.sel) {
                    fill(255);
                    Details.setValues(p.info.hist);
                    beginShape(); vertex(x-17,y+3); vertex(x-17,y-3); vertex(x-12,y); endShape(CLOSE);    
                    textSize(12);
                    text(p.info.city+' - '+p.info.hist[Annee.Id],this.x+10, height-45);
                }
                if( btDensite.value) {
                    let v = p.info.data.densite;
                    fill(btDensite.couleur(v));
                    if (v>100) {
                        beginShape(); vertex(x-10,y+3);vertex(x-2,y+3);vertex(x-6,y-3); endShape(CLOSE);
                    } else {
                        beginShape(); vertex(x-10,y-3);vertex(x-2,y-3);vertex(x-6,y+3); endShape(CLOSE);
                    }
                }
            }
        }
    }
}