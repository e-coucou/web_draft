let elt;
let path;

function windowResized() {
    let s = min(innerHeight,innerWidth) * 0.8;
    resizeCanvas(s,s);
    elt = new Particule(0, height/2);
    elt.applyForce(new createVector(0.3,0));
}

function setup() {
    canvas = createCanvas(1,1);
    canvas.parent('#canvas');
    windowResized();
    path = new Path();
    for (let i = 0; i< 4; i++) {
        let p = createVector(random(0, width), random(0, height));
        path.add(p);
    }
}

function draw() {
    background(51);
    path.show();
    elt.follow(path);
    // elt.seek(new createVector(mouseX, mouseY));
    elt.update();
    elt.edge();
    elt.show();
}