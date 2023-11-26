const NB_VILLES_LISTE = 35;
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
    let r = width/height;
    if ( ! getOkDivers(mouseX, mouseY)) {
        if (ctrl & key=='b') { LOOP =  !LOOP }
        if (key=='l') { loop(); }
        if (key=='d') { DEBUG = ! DEBUG; loop(); }
        if (key=='v') { VERBOSE = ! VERBOSE; }
        if (key=='g') { btDensite.switch(); }
        if (key==' ') { Annee.nextYear(); }
        if (key=='+') { REDUC += 50; drawMunipPrev(MIN_X,MAX_X,MIN_Y,MAX_Y);}
        if (key=='-') { REDUC -= 50; drawMunipPrev(MIN_X,MAX_X,MIN_Y,MAX_Y);}
        if (key=='a') { RATIO += 0.1; drawMunipPrev(MIN_X,MAX_X,MIN_Y,MAX_Y);}
        if (key=='w') { RATIO -= 0.1; drawMunipPrev(MIN_X,MAX_X,MIN_Y,MAX_Y);}
        if (key=='z') { zoomId = (zoomId + 1) % zoom.length ; surface = zoom[zoomId]*zoom[zoomId]*scale*scale /1000/1000;}
        if (key=='Z') { zoomId = max(0,(zoomId - 1)) ; surface = zoom[zoomId]*zoom[zoomId]*scale*scale/1000/1000;}
        if (key=='f') { FLAT = ! FLAT ;}
        if (key=='r') { RAINBOW = ! RAINBOW ;}
        if (keyCode == RIGHT_ARROW) { Annee.nextYear(); }
        if (keyCode == LEFT_ARROW) { Annee.prevYear(); }
        if (keyCode == UP_ARROW) { ListeVille.up();}
        if (keyCode == DOWN_ARROW) { ListeVille.down(); }
        if (key=='0') { Departements.sel=0; let [sum,nb]= selDept(0); Departements.setDeptValue(sum,nb); }
    }
    redraw();
    // console.log(key,keyCode)
    ctrl = (keyCode == 91) || (keyCode == 17);
    // console.log(ctrl);
}

function mouse_() {
    if (Departements.getSel(mouseX, mouseY)) {
        let [s,listeR] = Departements.newSel(mouseX,mouseY);
        let [sum, nb] = selDept(s,listeR);
        Departements.setDeptValue(sum,nb);
    }
    btDensite.click(mouseX,mouseY);

    if (!selectRange) { [selX,selY] = [mouseX,mouseY]; selectFix = ! selectFix;}
    redraw();
}
function mouseClicked(event) {
    mouse_();
}

// function mousePressed() {
//     mouse_();
// }

function searchVilles() {
    // console.log(this.value());
    searchInfo = '';
    let v = this.value().toUpperCase();
    villes.forEach(a => { a.sel=0; a.couleur=(color(255))});
    Departements.sel = 0;
    if (v != '') {
        let filtre = villes.filter(a =>  (a.city.toUpperCase().indexOf(v)>-1) );
        filtre.forEach(a=>{a.sel=2 ; a.couleur= color(0,255,0)});
        searchInfo = "#"+filtre.length;
        // console.log(filtre.length);
    }
}

function getOkDivers(x,y) {
    return (x>(7*width/8-30) & x<(width) & y>(3*height/4-30) & y<(3*height/4+30) );
}

class Annees {
    historique=[1968,1975,1982,1990,1999,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020];
    Amin = 1968;
    Amax = 2020;
    constructor() {
        this.Id=0;
        this.annee = 1968;
        this.iter=0;
    }

    setAnnee(a) {
        this.annee=a;
        this.updateYear();
    }
    updateYear() {
        let next = this.getOK();
        if ( next != -1) {
            this.iter = 0;
            this.Id = next;
            let [sum, nb] = selDept(Departements.getValue(Departements.sel),Departements.selRegionDept);
            Departements.setDeptValue(sum,nb);
            Zipf.setVilles(this.Id,villes);
        }    
    }

    nextYear() {
        this.iter += 1;
        this.annee = (this.annee - this.Amin + 1) % (this.Amax - this.Amin + 1) + this.Amin;
        this.updateYear();
    }

    prevYear() {
        this.iter = max(0, this.iter-1);
        if (this.annee == this.Amin) {
            this.annee = this.Amax;
        } else {
            this.annee = this.annee-1;
        }
        this.updateYear()
    }

    getOK() {
        return ( this.historique.indexOf(this.annee)) ;
    }

    getDelta(a_) {
        return (this.historique[a_+1] - this.historique[a_]) ;
    }

    getSlider(x,y) {
        let ok=false;
        let nb = this.Amax-this.Amin +1;
        let inc = width/2/nb;
        let Offset = 1*width/4;
        if (x>width/4 & x<(3*width/4-inc) & y>(height-30)) {
            this.annee = this.Amin + (round( (x - Offset) / inc ));
            this.updateYear();
            ok=true;
        }
        if (x>(width/4) & x<(3*width/4) & y>(height-50)) ok = true;
        return ok;
    }

    show() {
        textSize(32); textAlign(CENTER,CENTER);
        fill(200);noStroke();
        text(this.annee,width/2,height-45);

        let nb = this.Amax-this.Amin +1;
        let inc = width/2/nb;
        let Offset = 1*width/4;
        let y = height - 15, dy=5;
        stroke(color(cVert));
        line(Offset,y+dy,Offset+width/2-inc,y+dy);
        for (let i=0;i<nb;i++) {
            let x = i*inc + Offset;
            stroke(255);
            // if (this.getOK()== -1) stroke(120,0,0);
            line(x,y,x,y+dy);
        }
        let x = (this.annee-this.Amin) * inc +Offset;
        stroke(color(cVert));
        beginShape(); vertex(x-3,y-3); vertex(x+3,y-3); vertex(x,y+3); endShape(CLOSE);
    }
}

class Departement {
    Dmin = 0;
    Dmax = 97;
    constructor(x,y,w,h,dept,regions) {
        this.sel=0;
        this.focus=0;
        this.actif=0;
        this.x = x;
        this.y = y;
        this.w = w;
        let tmp = (this.Dmax-this.Dmin+2) / 4;
        this.h = round(tmp * 12);
        this.inc = this.w / 4;
        this.libelle = dept;
        this.regions = regions;
        this.libelle['00'] = 'France';
        this.deptNB = 0;
        this.deptPop = 0;
        this.regionsLib = '';
        this.selRegionDept = [];
    }

    setDeptValue(sum,nb) {
        this.deptPop = sum;
        this.deptNB = nb;
    }

    getLib(id) {
        let v = this.getValue(id);
        if (v<10) v = '0'+v;
        return (this.libelle[v]);
    }

    getId(x,y) {
        return int((x-this.x)/this.inc) + int((y-this.y)/12) * 4;
    }

    getValue(id) {
        if (id<20) return(id);
        if (id==20) return('2A');
        if (id==21) return('2B');
        if (id>21) return(id-1);
    }
    getReverseValue(v) {
        let r;
        if ((v)<20) r=int(v);
        if (v=='2A') r=20;
        if (v=='2B') r=21;
        if ((v)>20) r=int(v)+1;
        return r;
    }
    setFocus(d) {
        this.actif = this.getReverseValue(d);
    }

    newSel(x,y){
        this.sel = this.getId(x,y);
        let d = this.getValue(this.sel);
        if (this.sel !=0 ) {
        let tmp = this.regions.filter(a => {  return a.d.findIndex(b => b ==d) != -1 ;})[0];
        this.regionsLib = tmp.n;
        this.selRegionDept = tmp.d;
        } else {
            this.regionsLib = '';
            this.selRegionDept = [];
        }
        return [d, this.selRegionDept];
    }

    getSel(x,y) {
        let ok = false;
        this.focus = this.sel;
        if (x>(this.x) & x < (this.x+this.w) & y>(this.y-6) & y<(this.y+this.h-6)) {
            let nb = (this.Dmax-this.Dmin+1);
            this.focus = this.getId(x,y);
            ok = true;
        }
        return ok;
    }

    show() {
        rectMode(CORNER);
        let h = 12;
        textSize(10);
        textAlign(LEFT,CENTER);
        fill(255);noStroke();
        text('Départements',this.x,this.y-15);
        textAlign(CENTER,CENTER);
        for (let i=0; i< this.Dmax; i++) {
            fill(15); stroke(color(cVert)) ;
            if (i==this.sel | i==this.focus) fill(color(0,255,0));
            if (i==this.actif) fill(cVert);
            let x = this.x + i%4 * this.inc;
            let y = int(i/4) * h + this.y;
            rect(x,y,this.inc,h);
            noStroke();fill(255);
            text(this.getValue(i),x+this.inc/2,y+h/2);
        }
        let lib = this.getLib(this.sel);
        textAlign(LEFT,CENTER);
        text(lib,this.x,this.y+this.h+2*h);
        text('Communes : '+this.deptNB,this.x,this.y+this.h+3*h);
        text('Population: '+this.deptPop,this.x,this.y+this.h+4*h);
        text(this.regionsLib,this.x,this.y+this.h+5*h);
    }
}

class Detail {
    constructor(x,y,w,h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    setValues(v) {
        this.values= v;
        this.min_ = Math.min(...this.values);
        this.max_ = Math.max(...this.values);
        let ratio = this.h / (this.max_-this.min_); 
        this.valuesP = [];
        this.valuesG = [];
        for (let i=0;i<this.values.length;i++) {
            let a = (this.values[i]-this.min_) * ratio;
            this.valuesP.push(a);
        }
        let x = this.x;
        // let inc = this.w/(this.values.length+1);
        let nb = Annee.Amax - Annee.Amin + 1;
        let inc = this.w/nb;
        for (let i=0; i<this.valuesP.length; i++) {
            let p = this.valuesP[i];
            let y = (this.h-p) + this.y;
            // x += inc;
            x = this.x + (inc * (Annee.historique[i]-Annee.Amin)); 
            this.valuesG.push({x:x,y:y});
            if (i==Annee.Id) {
                this.actif = {x:x , y:y}
            }
        }
    }
    show() {
		rectMode(CORNER);
        fill(0);
        stroke(color(cVert)); strokeWeight(1);
        rect(this.x,this.y,this.w,this.h);
        stroke(255);
        beginShape();
        for (let v of this.valuesG) {
            vertex(v.x, v.y);
        }
        endShape();
        noStroke();textSize(10);textAlign(LEFT,CENTER);fill(255);
        text(this.max_,this.x+this.w+5,this.y+5);
        text(this.min_,this.x+this.w+5,this.y+this.h);
        fill(color(cVert));
        text(this.values[Annee.Id]==null?0:this.values[Annee.Id],this.x+this.w+5,this.y+this.h/2);
        stroke(color(cVert));noFill();strokeWeight(2);
        circle(this.actif.x, this.actif.y,10);
    }
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
        stroke(0,255,0);fill(0);
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