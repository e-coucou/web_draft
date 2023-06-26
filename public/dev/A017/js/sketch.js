const eC = {
  version: 'r01'
};

let base = [];
const nb = 5;
let radius, percent = 0.5;
let r, h, p;

function windowResized() {
  // resizeCanvas(windowWidth,windowHeight);
}

function preload() {}

function setup() {
  // createCanvas(windowWidth,windowHeight);
  createCanvas(400, 400);
  console.log("%c (ツ) # eCoucou " + eC.version + " # ", "background: #f00; color: #fff");
  // base.push(createVector(0,height,0));
  // base.push(createVector(width,height,1));
  // base.push(createVector(width/2,0,2));
  radius = width / 2;
  colorMode(HSB);
  for (let i = 0; i < nb; i++) {
    let a = i / nb * TWO_PI;
    let v = p5.Vector.fromAngle(a).setMag(radius).add(createVector(radius, radius));
    v.z = i;
    base.push(v);
    // base.push(createVector(random(width),random(height),i));
  }
  print(base);
  background(0);
  stroke(255);
  strokeWeight(4);
  for (let b of base) {
    point(b.x, b.y);
  }
  r = createVector(random(width), random(height));
  point(r.x, r.y);
  let b = random(base);
  h = p5.Vector.lerp(b, r, 0.5);
  strokeWeight(1);
}

function draw() {
  for (let i = 0; i < 1000; i++) {
    let b = random(base);
    if (p !== b) {
      h = p5.Vector.lerp(b, h, percent);
      stroke(b.z / nb * 360, 255, 255, 50);
      // switch(b.z) {
      // 	case 0: stroke(255,0,255); break;
      // 	case 1: stroke(255,255,0); break;
      // 	case 2: stroke(0,255,255); break;
      // }
      point(h.x, h.y);
    }
    p = b;
  }
}