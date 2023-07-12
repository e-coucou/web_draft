let a, b, c;

function setup() {
    canvas = createCanvas(400,400);
    canvas.parent('#canvas');
    c = createVector(width/4,height/2);
    b = createVector(width/4*3, height/2);
}

function projection(c, a, b) {
    let A = p5.Vector.sub(a, c);
    let B = p5.Vector.sub(b, c);
    B.normalize();
    let p =  A.dot(B);
    B.mult(p);
    return B.add(c);
}

function mousePressed() {
    b = createVector(mouseX, mouseY);
}

function draw() {
    background(0);
    a = createVector(mouseX, mouseY);
    // a = createVector(300, 100); // Pour la photo !
    p = projection(c, a, b);
    stroke(255);
    strokeWeight(2);
    noFill();
    line(c.x,c.y,a.x,a.y);
    line(c.x, c.y, b.x , b.y);
    stroke(0,0,255);
    strokeWeight(4);
    line(c.x, c.y, p.x, p.y);
    stroke(255,0,0);
    strokeWeight(1);
    line(a.x,a.y, p.x, p.y);
    strokeWeight(8);
    point(p.x,p.y);
    stroke(255,255,0);
    strokeWeight(8);
    point(c.x,c.y);

}