let w,h;
let n;
let angle;
let nb = 6;
let grid = [];


function init() {
    angle = 0;
    grid = [];
    for (let j = 0; j<nb; j++) {
        grid.push([]);
        for (let i = 0; i<nb; i++) {
            grid[j].push(new Lissajou());
        }
    }
}

function windowResized() {
    w = min(windowWidth,windowHeight) * 0.95;
    resizeCanvas(w,w);
    n = w / (nb+1);
    textSize(20);
    textAlign(CENTER,CENTER);
    init();
}

function setup() {
    canvas = createCanvas(innerWidth,innerHeight/3);
    canvas.parent('#canvas');
    windowResized();
}

function draw() {
    background(0);
    let grille = new Lissajou(nb);
    for (let i=0; i<nb ; i++) {
        noFill();
        stroke(255);
        strokeWeight(1);
        let x = (i+1) * n + n/2;
        let y = n/2;
        let r = n*0.9;
        circle(x,y,r);
        circle(y,x,r);
        text("x"+nf(i+1,0,0),x,y);
        text("x"+nf(i+1,0,0),y,x);
        stroke(255,0,255);
        strokeWeight(5);
        let px = r/2 * cos(angle*(i+1));
        let py = r/2 * sin(angle*(i+1));
        point(x+px, y+py);
        point(y+px, x+py);
        strokeWeight(1);
        stroke(120,120);
        line(x+px,y+py,x+px,height);
        line(y+px,x+py,width,x+py);
        for (let j=0; j<nb ; j++) {
            grid[j][i].addX(x+px);
            grid[i][j].addY(y+py +(i+1)*n);
        }
    }

    for (let j=0;j<nb;j++) {
        for (let i=0; i<nb; i++) {
            let p = grid[j][i];
            p.record();
            p.showPath();
            p.show();
        }
    }
    angle += 0.01;
    if (angle>=TWO_PI)
        { init(); }
}


class Lissajou {
    constructor() {
        this.path = [];
        this.current = {x:0, y:0};
    }
    addX(x_) {
        this.current.x = x_;
    }
    addY(y_) {
        this.current.y = y_;
    }
    record() {
        this.path.push({x:this.current.x, y:this.current.y});
    }
    show() {
        strokeWeight(3);
        stroke(0,0,255);
        point(this.current.x, this.current.y);
    }
    showPath() {
        strokeWeight(1);
        stroke(0,255,255);
        for (let p of this.path) {
            point(p.x,p.y);
        }
    }
}