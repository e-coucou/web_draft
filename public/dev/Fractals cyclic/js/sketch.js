const eC = {
  version: 'r01',
  author: 'eCoucou',
  date: 'nov.21'
};

const k = -7;
let first, end;
let path = [];

function windowResized() {
  // resizeCanvas(windowWidth,windowHeight);
}

function setup() {
  // createCanvas(windowWidth,windowHeight);
  createCanvas(600, 600);
  console.log("%c (ツ) # eCoucou " + eC.version + " # ", "background: #f00; color: #fff");
  first = new Cercle(width / 2, height / 2, 100, 1, null);
  let next = first;
  for (let i = 0; i < 100; i++) {
    next = next.addChild();
  }
  end = next;
}

function draw() {
  background(51);
  let next = first;
  while (next !== null) {
    next.update();
    next.show()
    next = next.child;
  }
  path.push(createVector(end.x, end.y));
  stroke(255, 0, 255);
  strokeWeight(2);
  beginShape()
  for (p of path) {
    vertex(p.x, p.y);
  }
  endShape();

}




//---------
class Cercle {
  constructor(x_, y_, r_, n_, parent_ = null) {
    this.x = x_;
    this.y = y_;
    this.r = r_;
    this.n = n_;
    this.speed = radians(pow(k, this.n - 1) / 100);
    this.angle = 0;
    this.parent = parent_;
    this.child = null;
  }

  update() {
    if (this.parent !== null) {
      this.angle += this.speed;
      let r = this.parent.r + this.r;
      this.x = this.parent.x + r * cos(this.angle);
      this.y = this.parent.y + r * sin(this.angle);
    }
  }

  addChild() {
    let newR = this.r / 3;
    this.child = new Cercle(this.x + this.r + newR, this.y, newR, this.n + 1, this);
    return this.child;
  }

  show() {
    stroke(255, 100);
    noFill();
    strokeWeight(1);
    circle(this.x, this.y, 2 * this.r);
  }
}