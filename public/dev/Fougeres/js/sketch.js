
let x,y;
let c;

function setup() {
    canvas = createCanvas(500,500);
    canvas.parent("canvas")
    x=0;
    y=0;
    c=color(255,255,255);
    background(0);
}
function nextPoint() {
    let nextX, nextY;
    let r = random(1);
    if (r<0.01) {
        // 1 : TIGE
        nextX = 0.;
        nextY = -0.16*y;
        c=color(0,255,0);
    } else { if (r<0.86){
        // 2 : petit Folioles
        nextX = 0.85*x + 0.04*y + 0;
        nextY = -0.04*x + 0.85*y + 1.6;
        c=color(255,255,255);
    } else { if (r<0.93) {
        // 3 : Grande Foliole de Gauche
        nextX = 0.2*x - 0.26*y + 0;
        nextY = .23*x + 0.22*y + 1.6;
        c=color(255,255,0);
    } else {
        // 4 : Grande Foliole de Droite
        nextX = -0.15*x + 0.28*y + 0;
        nextY = 0.26*x + 0.24*y + .44;
        c=color(100,255,20);
    } } }
    x = nextX;
    y = nextY;
}

function Cyclosorus() {
    let nextX, nextY;
    let r = random(1);
    if (r<0.02) {
        // 1 : TIGE
        nextX = 0.;
        nextY = 0.25*y - 0.4;
        c=color(0,255,0);
    } else { if (r<0.86){
        // 2 : petit Folioles
        nextX = 0.95*x + 0.005*y - 0.002;
        nextY = -0.005*x + 0.93*y + 0.5;
        c=color(255,255,255);
    } else { if (r<0.93) {
        // 3 : Grande Foliole de Gauche
        nextX = 0.035*x - 0.2*y - 0.09;
        nextY = .16*x + 0.04*y + 0.02;
        c=color(255,255,0);
    } else {
        // 4 : Grande Foliole de Droite
        nextX = -0.04*x + 0.2*y + 0.083;
        nextY = 0.16*x + 0.04*y + .12;
        c=color(100,255,20);
    } } }
    x = nextX;
    y = nextY;    
}

function drawPoint() {
    stroke(c);
    strokeWeight(1);

    let px = map(x, -2.1820, 2.6558, 0, width);
    let py = map(y, 0, 9.9983, height, 0);
    point(px, py);
}

function draw() {
    // background(51);
    for (let i=0; i< 1000; i++) {
        drawPoint();
        nextPoint();
        // Cyclosorus();
    }

    // console.log(x, y);
}