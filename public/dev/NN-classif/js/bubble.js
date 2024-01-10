const couleurs = [[255,0,0],[255,255,0],[255,0,255],[0,255,255], [0,0,255], [0,255,0]]

class Bubble {
    constructor(n,t,min,max) {
        this.n = n;
        this.size = t;
        this.min = min;
        this.max=max;
        this.bubble = [];
        this.init();
    }

    init() {
        let a = random()*TWO_PI, r = int((this.max-this.min)/2);
        let x0 = this.min + r, y0 = x0;
        let incA = (TWO_PI/this.n);
        let a1 = (r-r*cos(incA))/2;
        let a2 = (r*sin(incA))/2;
        let r0 = Math.sqrt(Math.pow(a1,2) + Math.pow(a2,2)) / 2;
        for (let t=0; t<this.n;t++) {
            let cx = x0 + r/2 * Math.cos(a);
            let cy = y0 + r/2 * Math.sin(a);
            for (let i =0; i<this.size;i++) {
                let aI = Math.random()*TWO_PI;
                let rI = Math.random()*r0;
                let x = rI*cos(aI)+cx;
                let y = rI*sin(aI)+cy;
                this.bubble.push( { v:new Vector(x,y,0), in:[x,y], out:[t]});
            }
            a = (a + incA);
        }
        this.bubble = shuffleFY(this.bubble);
    }

    convert() {
        let In =[], Out=[];
        for (let b of this.bubble) {
            In.push(b.in);
            Out.push(b.out);
            // if (b.out[0]==0) {
            //     Out.push([0])
            // } else {
            //     Out.push([1]);
            // }
        }
        return [In,Out];
    }

    show() {
        noStroke();
        for (let b of this.bubble) {
            let c = color(couleurs[b.out]);
            fill(c);
            circle(b.v.x(),b.v.y(),4);
        }
    }
}

// shuffle Fisher-Yates
function shuffleFY (a) {
    for (let i=a.length-1;i>=0;i--) {
        const j = Math.floor(Math.random() * (i+1));
        const t = a[i];
        a[i] = a[j];
        a[j] = t;
    }
    return a;
}