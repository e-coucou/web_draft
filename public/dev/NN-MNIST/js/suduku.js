class Suduku {
    constructor (first,x,y,w,) {
        this.first = first;
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=w;
        this.grille = [];
        for (let i =0;i<9;i++) {
            this.grille.push([]);
        }
    }

    getCoord(id) {
        let c = int(id % 9);
        let l = int(id / 9);
        return [c,l];
    }

    init() {
        for (let i=0;i<81;i++) {
            let [c,l] = this.getCoord(i);
            this.grille[c][l] = round(random(1,9));
        }
    }

    show() {
        fill(255);stroke(255);
        let step = this.w/9;
        textAlign(CENTER,CENTER);
        textSize(round(step / 1.5));
        for (let l=0;l<9;l++) {
            for (let c=0;c<9;c++) {
                let x = c*step + this.x;
                let y = l*step + this.y;
                fill(255);
                stroke(0);
                rect(x,y,step-1);
                fill(0);
                noStroke();
                let n = this.grille[c][l];
                if (n != 0) {      
                    text(this.grille[c][l],x+step/2,y+step/2);
                }
            }
        }
    }
}