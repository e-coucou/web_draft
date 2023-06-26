let pi=4;
let iter=0;
let piDiv;
let rateSlider;
let PIv;

function setup() {
    canvas = createCanvas(600,350);
    piDiv = createDiv(pi);
    rateSlider = createSlider(0,60,10);
    rateSlider.changed(rateChanged);
    frameRate(10);
    PIv = decrypte(PI,20);
}

function rateChanged() {
    frameRate(rateSlider.value());
}

function decrypte(n,p) {
    let s = ""+n;
    let v = [];
    v.push(s.charAt(0));
    for (let i=2; i<p; i++) {
        v.push(s.charAt(i));
    }
    return v;
}

function drawCircle() {
    let v = decrypte(pi,19);
    let i=0;
    let dec = width/18;
    for (let n of v) {
        let vOK = false;
        let x = (i+1)*dec;
        if (n == PIv[i]) {
            fill(0,100,255);
            vOK=true;
        } else {
            fill(255,120,0);
        }
        for(let j=0; j<n ; j++ ) {
            let y = height - (j+1)*dec;
            noStroke();
            strokeWeight(1);
            circle(x,y,dec/1.2);
        }
        for(let j=0; j<PIv[i] ; j++ ) {
            let y = height - (j+1)*dec;
            noFill();
            stroke(255);
            strokeWeight(2);
            circle(x,y,dec/1.05);
        }
        if (vOK) {
            fill(255);
            textSize(24);
            strokeWeight(1);
            textAlign(CENTER,CENTER);
            text(n,x,height-dec);
        }
        i++;
    }
}

function draw() {
    background(51);
    for (let i=0; i<100; i++) {
        pi -= ((iter%2 * -2)+1) * 4 / (iter*2 + 3);
        piDiv.html(pi);
        drawCircle();
        iter++;
    }
}