const eC = {
  version: 'r01'
};

let img;
let d;
let errR, errV, errB;
let f = 1;
let original;
let isGray;

var FloydButton, JarvisButton, StuckiButton, AtkinsonButton, BurkesButton;
var levelSlider;

function windowResized() {
  // resizeCanvas(windowWidth,windowHeight);
}

function preload() {
  original = loadImage('photos/P1001095.png');
}

function getID(x, y, i, j) {
  // return (x*d +i +(y* d +j)*width*d)*4;
  return (x + y * img.width) * 4;
}

function pColor(id, r, v, b) {
  img.pixels[id] = r;
  img.pixels[id + 1] = v;
  img.pixels[id + 2] = b;
  // img.pixels[id+3] = (r+v+b)/3;
}

function uColor(id, k) {
  let r = img.pixels[id]; //red(pict);
  let v = img.pixels[id + 1]; //green(pict);
  let b = img.pixels[id + 2]; //blue(pict);
  img.pixels[id] = r + errR * k;
  img.pixels[id + 1] = v + errV * k;
  img.pixels[id + 2] = b + errB * k;
}

function setup() {
  // createCanvas(windowWidth,windowHeight);
  createCanvas(720, 240);
  console.log("%c (ツ) # eCoucou " + eC.version + " # ", "background: #f00; color: #fff");

  let yc = 10;
  FloydButton = createButton('Floyd');
  FloydButton.mousePressed(floyd);
  FloydButton.position(642, yc);
  yc += 30;
  JarvisButton = createButton('Jarvis');
  JarvisButton.mousePressed(jarvis);
  JarvisButton.position(642, yc);
  yc += 30;
  StuckiButton = createButton('Stucki');
  StuckiButton.mousePressed(stucki);
  StuckiButton.position(642, yc);
  yc += 30;
  AtkinsonButton = createButton('Atkinson');
  AtkinsonButton.mousePressed(atkinson);
  AtkinsonButton.position(642, yc);
  yc += 30;
  BurkesButton = createButton('Burkes');
  BurkesButton.mousePressed(burkes);
  BurkesButton.position(642, yc);
  isGray = createCheckbox('Gris', true);
  isGray.position(642, height - 25);
  levelSlider = createSlider(1, 10, 1);
  f = levelSlider.value();
  colorMode(RGB);
  stroke(255);
  d = pixelDensity(1);
  // img.filter(GRAY);
  background(0);
  img = original.get();
  image(original, 0, 0);
}

function floyd() {
  img = original.get();
  if (isGray.checked()) img.filter(GRAY);
  img.loadPixels();
  for (let y = 0; y < img.height - 1; y++) {
    for (let x = 1; x < img.width - 1; x++) {
      let id = getID(x, y, 0, 0);
      let pict = img.pixels[id];
      r = img.pixels[id]; //red(pict);
      v = img.pixels[id + 1]; //green(pict);
      b = img.pixels[id + 2]; //blue(pict);
      let br = (r + v + b) / 3;
      let nr = round(f * r / 255) * 255 / f;
      let nv = round(f * v / 255) * 255 / f;
      let nb = round(f * b / 255) * 255 / f;

      pColor(id, nr, nv, nb);

      errR = r - nr;
      errV = v - nv;
      errB = b - nb;


      uColor(getID(x + 1, y), 7 / 16);
      uColor(getID(x - 1, y + 1), 3 / 16);
      uColor(getID(x, y + 1), 5 / 16);
      uColor(getID(x + 1, y + 1), 1 / 16);

      // img.pixels[id] = color(nr,nv,nb,br); //color(r,v,b);
    }
  }
  img.updatePixels();
  image(img, 320, 0);
}

function jarvis() {
  img = original.get();
  if (isGray.checked()) img.filter(GRAY);
  img.loadPixels();
  for (let y = 0; y < img.height - 2; y++) {
    for (let x = 2; x < img.width - 2; x++) {
      let id = getID(x, y, 0, 0);
      let pict = img.pixels[id];
      r = img.pixels[id]; //red(pict);
      v = img.pixels[id + 1]; //green(pict);
      b = img.pixels[id + 2]; //blue(pict);
      let br = (r + v + b) / 3;
      let nr = round(f * r / 255) * 255 / f;
      let nv = round(f * v / 255) * 255 / f;
      let nb = round(f * b / 255) * 255 / f;
      pColor(id, nr, nv, nb);
      errR = r - nr;
      errV = v - nv;
      errB = b - nb;
      uColor(getID(x + 1, y), 7 / 48);
      uColor(getID(x + 2, y), 5 / 48);
      uColor(getID(x - 2, y + 1), 3 / 48);
      uColor(getID(x - 1, y + 1), 5 / 48);
      uColor(getID(x + 0, y + 1), 7 / 48);
      uColor(getID(x + 1, y + 1), 5 / 48);
      uColor(getID(x + 2, y + 1), 3 / 48);
      uColor(getID(x - 2, y + 2), 1 / 48);
      uColor(getID(x - 1, y + 2), 3 / 48);
      uColor(getID(x + 0, y + 2), 5 / 48);
      uColor(getID(x + 1, y + 2), 3 / 48);
      uColor(getID(x + 2, y + 2), 1 / 48);
    }
  }
  img.updatePixels();
  image(img, 320, 0);
}

function stucki() {
  img = original.get();
  if (isGray.checked()) img.filter(GRAY);
  img.loadPixels();
  for (let y = 0; y < img.height - 2; y++) {
    for (let x = 2; x < img.width - 2; x++) {
      let id = getID(x, y, 0, 0);
      let pict = img.pixels[id];
      r = img.pixels[id]; //red(pict);
      v = img.pixels[id + 1]; //green(pict);
      b = img.pixels[id + 2]; //blue(pict);
      let br = (r + v + b) / 3;
      let nr = round(f * r / 255) * 255 / f;
      let nv = round(f * v / 255) * 255 / f;
      let nb = round(f * b / 255) * 255 / f;
      pColor(id, nr, nv, nb);
      errR = r - nr;
      errV = v - nv;
      errB = b - nb;
      uColor(getID(x + 1, y), 8 / 42);
      uColor(getID(x + 2, y), 4 / 42);
      uColor(getID(x - 2, y + 1), 2 / 42);
      uColor(getID(x - 1, y + 1), 4 / 42);
      uColor(getID(x + 0, y + 1), 8 / 42);
      uColor(getID(x + 1, y + 1), 4 / 42);
      uColor(getID(x + 2, y + 1), 2 / 42);
      uColor(getID(x - 2, y + 2), 1 / 42);
      uColor(getID(x - 1, y + 2), 2 / 42);
      uColor(getID(x + 0, y + 2), 4 / 42);
      uColor(getID(x + 1, y + 2), 2 / 42);
      uColor(getID(x + 2, y + 2), 1 / 42);
    }
  }
  img.updatePixels();
  image(img, 320, 0);
}

function atkinson() {
  img = original.get();
  if (isGray.checked()) img.filter(GRAY);
  img.loadPixels();
  for (let y = 0; y < img.height - 2; y++) {
    for (let x = 1; x < img.width - 2; x++) {
      let id = getID(x, y, 0, 0);
      let pict = img.pixels[id];
      r = img.pixels[id]; //red(pict);
      v = img.pixels[id + 1]; //green(pict);
      b = img.pixels[id + 2]; //blue(pict);
      let br = (r + v + b) / 3;
      let nr = round(f * r / 255) * 255 / f;
      let nv = round(f * v / 255) * 255 / f;
      let nb = round(f * b / 255) * 255 / f;
      pColor(id, nr, nv, nb);
      errR = r - nr;
      errV = v - nv;
      errB = b - nb;
      uColor(getID(x + 1, y), 1 / 8);
      uColor(getID(x + 2, y), 1 / 8);
      uColor(getID(x - 1, y + 1), 1 / 8);
      uColor(getID(x + 0, y + 1), 1 / 8);
      uColor(getID(x + 1, y + 1), 1 / 8);
      uColor(getID(x + 0, y + 2), 1 / 8);
    }
  }
  img.updatePixels();
  image(img, 320, 0);
}

function burkes() {
  img = original.get();
  if (isGray.checked()) img.filter(GRAY);
  img.loadPixels();
  for (let y = 0; y < img.height - 1; y++) {
    for (let x = 2; x < img.width - 2; x++) {
      let id = getID(x, y, 0, 0);
      let pict = img.pixels[id];
      r = img.pixels[id]; //red(pict);
      v = img.pixels[id + 1]; //green(pict);
      b = img.pixels[id + 2]; //blue(pict);
      let br = (r + v + b) / 3;
      let nr = round(f * r / 255) * 255 / f;
      let nv = round(f * v / 255) * 255 / f;
      let nb = round(f * b / 255) * 255 / f;
      pColor(id, nr, nv, nb);
      errR = r - nr;
      errV = v - nv;
      errB = b - nb;
      uColor(getID(x + 1, y), 8 / 32);
      uColor(getID(x + 2, y), 4 / 32);
      uColor(getID(x - 2, y + 1), 2 / 32);
      uColor(getID(x - 1, y + 1), 4 / 32);
      uColor(getID(x + 0, y + 1), 8 / 32);
      uColor(getID(x + 1, y + 1), 4 / 32);
      uColor(getID(x + 2, y + 1), 2 / 32);
    }
  }
  img.updatePixels();
  image(img, 320, 0);
}

function draw() {
  f = levelSlider.value();
}