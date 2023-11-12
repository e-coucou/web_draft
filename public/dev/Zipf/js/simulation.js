function mapLog(v0,x0,x1,y0,y1) {
    let v = (v0>=0)?Math.log(v0):0;
    return ((v-x0) * (y1-y0) / (x1 - x0) + y0 );
}

function Init(nb) {
    for ( let i=0; i<nb;i++) {
        villes.push(300);
    }
}

function Evolution() {
    let min_=Infinity, max_=0;
    for (let v in villes) {
        villes[v] = round(villes[v] * (1+ randomGaussian()/100) + 0.022);
        if (villes[v] > max_) max_ = villes[v];
        if (villes[v] < min_) min_ = villes[v];
    }
    villes.sort((a,b)=>{return (b-a);})
    return [min_, max_];
}

function drawVilles(min_, max_) {
    fill(255);
    noStroke();
    let cnt = villes.length;
    const a1 = Math.log(cnt);
    let inc = width/cnt;
    let x0 = (min_>0)?Math.log(min_):0;
    let x1 = log(max_);
    for (let i=0; i<cnt; i++) {
        // let y = map(villes[i],min_, max_,0,height);
        let y = mapLog(villes[i],x0, x1,height,0);
        let x = mapLog(i+1,0,a1,0,width);
        // let x = i * inc;
        circle(x,y,2);
    }
}

function simul() {
    for (let i=0; i<365;i++) {
        [min_, max_] = Evolution();
        iter++;
    }
}


class ZIPF {
    constructor(x,y,w,h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.villes = [];
    }

    setVilles(id,villes) {
        this.villes=[];
        for (let v of villes) {
            this.villes.push(v.hist[id]);
        }
        this.villes.sort((a,b)=>{return b-a;});
        this.vCoord=[];
        let [min_, max_] = this.getMinMax();
        let cnt = this.villes.length;
        const a1 = Math.log(cnt);
        let x0 = (min_>0)?Math.log(min_):0;
        let x1 = log(max_);
        for (let i=0; i<cnt; i++) {
            let y = mapLog(this.villes[i],x0, x1,this.h-5,0+5);
            let x = mapLog(i+1,0,a1,this.x-this.w/2+5,this.x+this.w/2-5);
            this.vCoord.push({x:x,y:y});
        }    
    }

    getMinMax() {
        let min_=Infinity, max_= 0;
        for (let v of this.villes) {
            if (v>max_) max_ = v;
            if (v<min_) min_ = v;
        }
        return [min_, max_];
    }
    
    drawVilles() {
        fill(255);
        noStroke();
        for (let v of this.vCoord) {
            circle(v.x,v.y,2);
        }
    }
    
    show() {
        rectMode(CENTER);
        fill(0);
        stroke(color(cVert));
        rect(this.x,this.y,this.w,this.h);
        this.drawVilles();
        textAlign(LEFT,CENTER);textSize(10);noStroke();
        text("Répartition log/log",this.x-this.w/2+5,this.y+this.h/2-10);
    }
}