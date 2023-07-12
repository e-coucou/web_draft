let w,h;
let n;
let angle;
let nb = 10;
let path = [];
let grid = [];

function windowResized() {
    w = min(windowWidth,windowHeight) * 0.95;
    resizeCanvas(w,w);
    angle = 0;
    path = [];
    for (let i = 0; i<nb; i++) {
        grid.push([]);
    }
}

function setup() {
    canvas = createCanvas(innerWidth,innerHeight/3);
    canvas.parent('#canvas');
    windowResized();
    n = w / (nb+1);
}

function draw() {
    background(0);
    let grille = new Lissajou(nb);
    for (let i=0; i<nb ; i++) {
        noFill();
        stroke(255);
        strokeWeight(2);
        let x = (i+1) * n + n/2;
        let y = n/2;
        let r = n*0.9;
        circle(x,y,r);
        circle(y,x,r);
        strokeWeight(8);
        let px = r/2 * cos(angle*(i+1));
        let py = r/2 * sin(angle*(i+1));
        point(x+px, y+py);
        point(y+px, x+py);
        strokeWeight(1);
        stroke(120,120);
        line(x+px,y+py,x+px,height);
        line(y+px,x+py,width,x+py);
        grille.addX(x+px,i);
        grille.addX(y+py,i);
        // for (let j=0; j<3; j++) {
        //     strokeWeight(2);
        //     stroke(0,0,255);
        //     point(x+px ,y+py +(i+1)*n);

        //     // grig[i][j] = {x+px,y+py};
        //     // grig[j][i] = {y+px , x+py};
        // }
    }
    angle += 0.01;

}


class Lissajou {
    constructor(n_) {
        this.grid = [];
        this.nb=n_;
        for (let i=0; i< this.nb;i++){
            this.grid.push([]);
        }
    }
    addX(x_,j_) {
        for (let i = 0; i<this.nb;i++) {
            this.grid[j_][i] = x_;
        }
    }
    addY(y_,j_) {
        for (let i = 0; i<this.nb;i++) {
            this.grid[i][j_] = y_;
        }
    }
}