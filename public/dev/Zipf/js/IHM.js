const NB_VILLES_LISTE = 35;

// Gestion du clavier
function keyPressed() {
    if (key=='b') { LOOP =  !LOOP }
    if (key=='l') { loop(); }
    if (key=='d') { DEBUG = ! DEBUG; }
    if (key=='v') { VERBOSE = ! VERBOSE; }
    if (key=='g') { btDensite.switch(); }
    if (key==' ') { Annee.nextYear(); }
    if (keyCode == RIGHT_ARROW) { Annee.nextYear(); }
    if (keyCode == LEFT_ARROW) { Annee.prevYear(); }
    if (key=='z') { zoomId = (zoomId + 1) % zoom.length ;}
    if (key=='Z') { zoomId = max(0,(zoomId - 1)) ;}
    if (keyCode == UP_ARROW) { listId = max(0,min(listId-1,villesSel-1)); }
    if (keyCode == DOWN_ARROW) { listId = min(listId +1, NB_VILLES_LISTE , villesSel-1) ; }
    if (key=='0') { Departements.sel=0; let [sum,nb]= selDept(0); Departements.setDeptValue(sum,nb); }
}

function mousePressed() {
    if (Departements.getSel(mouseX, mouseY)) {
        let s = Departements.newSel(mouseX,mouseY);
        let [sum, nb] = selDept(s);
        Departements.setDeptValue(sum,nb);
    }
    btDensite.click(mouseX,mouseY);

    if (!selectRange) { [selX,selY] = [mouseX,mouseY]; selectFix = ! selectFix;}
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

    updateYear() {
        let next = this.getOK();
        if ( next != -1) {
            this.iter = 0;
            this.Id = next;
            let [sum, nb] = selDept(Departements.getValue(Departements.sel));
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
        this.annee = max(this.Amin, this.annee-1);
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
        beginShape();
        vertex(x-3,y-3);
        vertex(x+3,y-3);
        vertex(x,y+3);
        endShape(CLOSE);
        // circle(x,y,5);
    }
}

class Departement {
    Dmin = 0;
    Dmax = 97;
    constructor(x,y,w,h,dept) {
        this.sel=0;
        this.focus=0;
        this.actif=0;
        this.x = x;
        this.y = y;
        this.w = w;
        let tmp = (this.Dmax-this.Dmin+1) / 4;
        this.h = round(tmp * 12);
        this.inc = this.w / 4;
        this.libelle = dept;
        this.libelle['00'] = 'France';
        this.deptNB = 0;
        this.deptPop = 0;
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
        return int((x-this.x + this.inc/2)/this.inc) + int((y-this.y+6)/12) * 4;
    }

    getValue(id) {
        if (id<20) return(id);
        if (id==20) return('2A');
        if (id==21) return('2B');
        if (id>21) return(id-1);
    }

    setFocus(d) {
        if ((d)<20) this.actif=int(d);
        if (d=='2A') this.actif=20;
        if (d=='2B') this.actif=21;
        if ((d)>20) this.actif=int(d)+1;
    }

    newSel(x,y){
        this.sel = this.getId(x,y);
        return (this.getValue(this.sel));
    }
    getSel(x,y) {
        let ok = false;
        this.focus = this.sel;
        if (x>(this.x-this.inc/2) & x < (this.x+this.w-this.inc/2) & y>(this.y-6) & y<(this.y+this.h-6)) {
            let nb = (this.Dmax-this.Dmin+1);
            this.focus = this.getId(x,y);
            ok = true;
        }
        return ok;
    }

    show() {
        rectMode(CENTER);
        let h = 12;
        textSize(10);
        textAlign(LEFT,CENTER);
        fill(255);noStroke();
        text('Départements',this.x-this.inc,this.y-15);
        textAlign(CENTER,CENTER);
        for (let i=0; i< this.Dmax; i++) {
            fill(15); stroke(color(cVert)) ;
            if (i==this.actif) fill(0,180,255);
            if (i==this.sel | i==this.focus) fill(color(cVert));
            let x = this.x + i%4 * this.inc;
            let y = int(i/4) * h + this.y;
            rect(x,y,this.inc,h);
            noStroke();fill(255);
            text(this.getValue(i),x,y);
        }
        let lib = this.getLib(this.sel);
        textAlign(LEFT,CENTER);
        text(lib,this.x-this.inc,this.y+this.h+h);
        text('Communes : '+this.deptNB,this.x-this.inc,this.y+this.h+2*h);
        text('Popuplation: '+this.deptPop,this.x-this.inc,this.y+this.h+3*h);
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
        stroke(color(cVert));
        circle(this.actif.x, this.actif.y,4);
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
            return color(255,0,0);
        } else {
            return color(0,0,255);
        }
    }

    show() {
        rectMode(CORNER);
        fill(255,0,0);
        rect(this.x,this.y,this.w/2,this.h);
        fill(0,0,255);
        rect(this.x+this.w/2,this.y,this.w/2,this.h);
    }
}