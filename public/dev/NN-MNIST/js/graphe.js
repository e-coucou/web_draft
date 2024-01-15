const Xgap = 2;

class Graphe {
    constructor(val,x,y,w,h) {
        this.data = val;
        this.color = color(0,0,255,180);
        this.bkColor = color(31);
        this.txtColor = color(255,180);
        this.init(x,y,w,h);
        this.seuilH = 0;
        this.seuilL = 0;
        this.titre = 'eCoucou';
        this.reste = 0;
    }

    setTitre(t) {
        this.titre = t;
    }

    init(x,y,w,h) {
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=h;
        this.incX = w /this.data.length;
        this.Yscale = h / Math.max(...this.data); 
    }

    setMaxY(yM) {
        this.Yscale = this.h / yM;
    }

    setSeuilSup(s) {
        this.seuilH = s;
    }

    setSeuilInf(s) {
        this.seuilL = s;
    }

    show() {
        noStroke();
        fill(this.bkColor);
        rect(this.x,this.y,this.w,this.h);
        fill(this.color);
        textSize(Math.min(this.h/12,8));textAlign(CENTER,CENTER);
        let trig = false, cpt=0;
        for (let i=0;i<this.data.length;i++) {
            let v = this.data[i];
            let x = i*this.incX + this.x + Xgap/2;
            let y = this.data[i] * this.Yscale;
            fill(this.color); noStroke();
            rect(x,this.h + this.y - y,this.incX-Xgap,y);
            fill(this.txtColor);noStroke();strokeWeight(1);
            text(i,x+this.incX/2,this.y+this.h+5);
            if (this.seuilH != 0 & trig== false & cpt>this.seuilH) {
                stroke(255,0,0); strokeWeight(3);
                line(x,this.y,x,this.h+this.y);
                trig=true;
                this.reste = (1 - cpt)*100;
            }
            if (this.seuilL != 0 & trig== false & (cpt+v)>this.seuilL) {
                stroke(0,255,0); strokeWeight(3);
                line(x,this.y,x,this.h+this.y);
                trig=true;
                this.reste = (1 - cpt)*100;
            }
            cpt += v;
        }
        textSize(14);textAlign(LEFT,CENTER);
        fill(255);noStroke();strokeWeight(1);
        text(this.titre,this.x+20,this.y+20);

        text(nf(this.reste,1,1)+'%',this.x+this.w-50,this.y+this.h/2);
        textSize(8);
        text('pMax='+nf(this.h/this.Yscale,1,3),this.x+this.w-46,this.y+8);
    }
}


class Courbe extends Graphe  {
    constructor(val,x,y,w,h) {
        super(val,x,y,w,h);
        // super.init(x,y,w,h);
    }

    show() {
        noStroke();
        fill(this.bkColor);
        rect(this.x,this.y,this.w,this.h);
        fill(this.color);
        textSize(Math.min(this.h/12,8));textAlign(CENTER,CENTER);
        let trigL = false, trigH = false, seuilL=0, seuilH;
        beginShape();
        for (let i=0;i<this.data.length;i++) {
            let v = this.data[i];
            let x = i*this.incX + this.x + Xgap/2;
            let y = this.data[i] * this.Yscale;
            stroke(this.color); noFill();//noStroke();
            vertex(x,this.h + this.y - y);
            if (this.seuilH != 0 & trigH== false & v<this.seuilH) {
                trigH=true;
                seuilH = i;
            }
            if (this.seuilL != 0 & trigL == false & v>=this.seuilL) {
                trigL=true;
                seuilL = i;
            }
        }
        endShape();
        fill(this.txtColor);noStroke();strokeWeight(2);
        for (let i=0;i<this.data.length;i+=5) {
            let x = i*this.incX + this.x + Xgap/2;
            text(i,x+this.incX/2,this.y+this.h+5);
        }
        //axe abscisse
        stroke(this.txtColor);strokeWeight(1);
        line(this.x,this.y+this.h,this.x+this.w,this.y+this.h);
        //seuil Low
        if (trigL) {
            let x = seuilL*this.incX + this.x + Xgap/2;
            stroke(this.txtColor); strokeWeight(1);
            line(x,this.y,x,this.h+this.y);
        }
        //seuil High
        if (trigH) {
            let x = seuilH*this.incX + this.x + Xgap/2;
            stroke(this.txtColor); strokeWeight(1);
            line(x,this.y,x,this.h+this.y);
        }
        textSize(14);textAlign(LEFT,CENTER);
        fill(255);noStroke();strokeWeight(1);
        text(this.titre,this.x+20,this.y+20);

        if (trigL) {
            text('>'+nf(this.seuilL*100,1,1)+'%',this.x+this.w-50,this.y+this.h/2);
        }
        if (trigH) {
            text('<'+nf(this.seuilH,1,2),this.x+this.w-50,this.y+this.h/2);
        }
        textSize(8);
        let vMin = Math.min(...this.data);
        text('Max='+nf(this.h/this.Yscale,1,3),this.x+this.w-46,this.y+8);
        text('Min='+nf(vMin,1,3),this.x+this.w-46,this.y+20);
    }
}

class Correlation {
    constructor(val,x,y,w) {
        this.data=val;
        this.init(x,y,w);
        this.color = color(0,0,255);
        this.bkColor = color(51);
        this.txtColor = color(255,180);
        this.max=0;
        this.min=0;
        this.titre = ['Negatif','Positif','Vrai','Faux'];
    }

    setMax(m) {
        this.max = m;
    }

    setMin(m) {
        this.min = m;
    }
    init(x,y,w) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.incX = (w-Xgap)/2;
    }
    show() {
        noStroke();
        fill(this.bkColor);
        rect(this.x,this.y,this.w,this.w);
        fill(this.color);
        textSize(Math.min(this.w/3,20));textAlign(CENTER,CENTER);
        for (let i=0;i<this.data.length;i++) {
            let c = this.data[i];
            for (let j=0; j<c.length;j++) {
                let v = this.data[j][i];
                let x = i*this.incX + this.x + Xgap/2;
                let y = j*this.incX + this.y + Xgap/2;
                fill(this.color); noStroke();
                if (this.max>0 & i==1 & j==0 & v>this.max) fill(255,0,0,130);
                if (this.min>0 & i==1 & j==1 & v<this.min) fill(255,120,50);
                rect(x,y,this.incX-Xgap,this.incX-Xgap);
                fill(this.txtColor);noStroke();strokeWeight(1);
                text(v,x+this.incX/2,y+this.incX/2);
            }
        }
        textSize(14);textAlign(LEFT,CENTER);
        fill(255);noStroke();strokeWeight(1);
        textAlign(CENTER,CENTER);
        text(this.titre[0],this.x+this.incX/2,this.y-20);
        text(this.titre[1],this.x+1.5*this.incX,this.y-20);
        text(this.titre[2],this.x-this.incX/2,this.y+this.incX/2);
        text(this.titre[3],this.x-this.incX/2,this.y+1.5*this.incX);
    }
}