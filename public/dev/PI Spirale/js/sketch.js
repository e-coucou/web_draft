let num=1;
let inc = 2;
let nbInc=1;
let tourne=1;
let etat=0;
let x,y, px, py;

function setup() {
    canvas = createCanvas(500,500);
    // frameRate(5);
    textSize(24);
    textAlign(CENTER,CENTER);
    x = width/2;
    y = height/2;
    px = y; py=y;
    background(51);
}

function estPrime(n) {
    if (n===1) return false;
    for (let i=2; i<=sqrt(n); i += 1) {
        if (n%i === 0) {
            return false;
        }
    }
    return true;
}

function draw() {
    // background(51);
    for (let j=0; j<100; j+=1) {
        // text(num, x, y)
        // stroke(120);
        // line(px,py,x,y)
        // noStroke;
        stroke(255);
        fill(255);
        if (estPrime(num)) {
            circle(x,y,inc);
        // } else {
        //     circle(x,y,0);
        }
        px =x; py=y;
        switch (etat) {
            case 0 : // droite 
                x += inc;
            break;
            case 1 : // haut 
                y -= inc;
            break;
            case 2 : // gauche 
                x -= inc;
            break;
            case 3 : // bas 
                y += inc;
            break;
        }
        if (num%nbInc===0) {
            etat = (etat + 1) % 4;
            tourne +=1;
            if (tourne%2 ===0) { nbInc +=1;}
        }
        num += 1;
        }
    if (num>100000) {noLoop();}
}