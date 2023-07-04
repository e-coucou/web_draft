const eC = {version: 'r01'};
let murs = [];
let ray;
let particule;
let w, h;
let xOff = 0, yOff= 10;


function keyPressed() {
    if (key == 'a') {
        particule.rotate(0.03);
    }
    if (key == 'p') {
        particule.rotate(-0.03);
    }
}

function setup() {
    let canvas = createCanvas(800,400);
    canvas.parent("#canvas");
    w = width / 2;
    h = height;
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    for (let i = 0; i<5 ; i++) {
        let x1 = random(w);
        let x2 = random(w);
        let y1 = random(height);
        let y2 = random(height);
        murs.push(new Mur(x1,y1,x2,y2));
    }
    // bordure
    murs.push(new Mur(0,0,w,0));
    murs.push(new Mur(w,0,w,height));
    murs.push(new Mur(w,height,0,height));
    murs.push(new Mur(0,height,0,0));
    // ray = new Ray(100,200);
    particule = new Particule()
}

function draw() {
    background(0);
    fill(255);
    rect(w,0,w,h/2);
    fill(120);
    rect(w,h/2,w,h/2);

    if (keyIsDown(LEFT_ARROW)) {
        particule.rotate(-0.05);
    }  
    if (keyIsDown(RIGHT_ARROW)) {
        particule.rotate(0.05);
    }  
    if (keyIsDown(UP_ARROW)) {
        particule.move(1);
    }  
    if (keyIsDown(DOWN_ARROW)) {
        particule.move(-1);
    }  
    // ray.setDir(mouseX,mouseY);
    for (mur of murs) {
        mur.show();
    }
    // particule.update(min(mouseX,w), mouseY);
    // particule.update(noise(xOff)*w , noise(yOff)*h);
    // xOff += 0.01;
    // yOff += 0.01;
    const scene = particule.lookAt(murs);
    particule.show();
    let sw = w / scene.length;

    push();
    translate(w,0);
    for (let i=0; i<scene.length ; i++) {
        noStroke();
        const Sq = scene[i] * scene[i];
        const wSq = w * w;
        const b = map(Sq, 0,wSq, 255,0);
        const sh = map(scene[i], 0,w, h, 0);
        fill(b);
        rectMode(CENTER);
        rect(sw*(i+0.5), h/2, sw , sh);
    }
    pop();
    // ray.show();
    // let point = ray.cast(murs);
    // if (point) {
    //     stroke(255);
    //     circle(point.x,point.y,4);
    // }
}