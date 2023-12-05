const eC = {version: 'v0.01', release:'r0', date:'nov/23', owner: 'rky', code:'y2H', annee:'2023', maj:'nov/23'};
let mobile;
let DEBUG = true;

let grille = [
    [0,6,1,0,0,3,0,0,5],
    [2,0,0,0,1,4,0,0,0],
    [0,0,7,0,0,2,0,0,0],
    [0,4,2,0,0,0,0,6,9],
    [0,0,9,0,0,0,7,0,0],
    [7,3,0,0,0,0,2,4,0],
    [0,0,0,3,0,0,5,0,0],
    [0,0,0,2,4,0,0,0,8],
    [8,0,0,7,0,0,3,9,0]
    ];

function windowResized() {
    let m = min(innerHeight,innerWidth);
    let w_ = m*0.9;
    let h_ = w_;
    resizeCanvas(w_,h_);
}


function keyPressed() {
    if (key=='d') {
        DEBUG = ! DEBUG;
    }
}

function mousePressed() {
}

function setup() {
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    canvas = createCanvas(10,10); // mise en place du ratio 0.59
    canvas.parent("#canvas");
    windowResized();
}

function drawGrille() {
    let step = width/9;
    textAlign(CENTER,CENTER);
    textSize(round(step / 1.5));
    for (let i=0;i<9;i++) {
        for (let j=0;j<9;j++) {
            let x = i*step;
            let y = j*step;
            fill(100);
            stroke(255);
            rect(x,y,step-1);
            fill(255);
            noStroke();
            let n = grille[i][j];
            if (n != 0) {      
                text(grille[i][j],x+step/2,y+step/2);
            }
        }
    }
}

function possible(i,j) {
    let ret = [1,2,3,4,5,6,7,8,9];
    
}

function draw() {
    background(51);
    drawGrille();
}