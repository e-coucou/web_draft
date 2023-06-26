let t = 50; //espacement entre latte
let l = 25; // longueur de l'aiguille

let nbTotal=0;
let nbCross=0;
let divPI;

function setup() {
    const canvas = createCanvas(600,600);
    canvas.parent("#canvas");
    divPI = createDiv("");
    divPI.parent=("#pi");

    background(51);
    stroke(120);
    strokeWeight(1);
    for (let i=0; i<width; i+=t) {
        line(i,0,i,height);
    }
    // frameRate(1);
}

function draw() {
    for (let i=0; i<1000; i++) {
        let angle = random(0, PI);
        let x = random(0,width);
        let y = random(0,height);

        let closest = Math.round(x/t);
        let dist = Math.abs(closest*t - x);
        let p =(l/2*Math.sin(angle));
        if (dist < p ) {
            strokeWeight(1);
            stroke(0,255,0);
            nbCross++;
        } else {
            strokeWeight(1);
            stroke(160);
        }

        push();
        translate(x, y);
        rotate(angle);
        line(0,-l/2,0,l/2);
        pop();

        nbTotal++;
    }
    const pi_ = nbTotal/nbCross * 2 * l / t;

    divPI.html("Evaluation de Pi : "+nf(pi_,-3,5));
}