const eC = {
  version: 'r01'
};

let formes = [];

function windowResized() {
  resizeCanvas(windowWidth, 300); //windowHeight);
}

function preload() {}

function setup() {
  // createCanvas(windowWidth,windowHeight);
  createCanvas(windowWidth, 200);
  console.log("%c (ツ) # eCoucou " + eC.version + " # ", "background: #f00; color: #fff");
  for (let i = 0; i < 3; i++) {
    formes.push(new Forme());
  }
}

function draw() {
  background(0);
  for (f of formes) {
    f.update();
    f.edges();
    f.show();
  }
}

//---------
class Forme {
  constructor() {
    this.nb = random(3, 5);
    this.points = [];
    this.vel = createVector(random(-0.3, 0.3), random(-0.3, 0.3));
    this.pos = createVector(random(width), random(height));
    this.w = random(30, width - this.pos.x);
    this.h = random(15, height - this.pos.y);
    this.init();
  }

  init() {
    for (let i = 0; i < this.nb; i++) {
      this.points.push(new Particule(random(this.pos.x, this.pos.x + this.w), random(this.pos.y, this.pos.y + this.h)));
    }
  }

  update() {
    this.pos.add(this.vel);
    for (let p of this.points) {
      p.edges(this.pos, this.w, this.h);
      p.update();
      p.show();
    }
  }

  edges() {
    if (this.pos.x > width - this.w || this.pos.x < 0) this.vel.x *= -1;
    if (this.pos.y > height - this.h || this.pos.y < 0) this.vel.y *= -1;
  }

  show() {
    stroke(255, 120);
    strokeWeight(1);
    noFill();
    beginShape();
    for (let p of this.points) {
      vertex(p.pos.x, p.pos.y);
      stroke(255, random(100, 200));
    }
    endShape(CLOSE);

    // stroke(255, 0, 255, 120);
    // strokeWeight(1);
    // rect(this.pos.x, this.pos.y, this.w, this.h);
  }
}

//---------
class Particule {
  constructor(x_, y_) {
    this.pos = createVector(x_, y_);
    this.vel = createVector(random(-1, 1), random(-1, 1));
    this.size = random(4, 10);

  }

  update() {
    this.pos.add(this.vel);
  }

  edges(m_, w_, h_) {
    if (this.pos.x > m_.x + w_) {
      this.pos.x = m_.x + w_ - 1;
      this.vel.x *= -1;
    } else if (this.pos.x < m_.x) {
      this.pos.x = m_.x + 1;
      this.vel.x *= -1;
    } else if (this.pos.y > m_.y + h_) {
      this.pos.y = m_.y + h_ - 1;
      this.vel.y *= -1;
    } else if (this.pos.y < m_.y) {
      this.vel.y *= -1;
      this.pos.y = m_.y + 1;
    }
  }

  show() {
    stroke(255, random(150, 255));
    strokeWeight(this.size);
    point(this.pos.x, this.pos.y);
  }
}