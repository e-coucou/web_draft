let zoom = 3;
let minX = -2.5 + zoom / 2;
let minY = 0;

function setup() {
  createCanvas(1000, 1000);
  background(55);
  pixelDensity(1);
  updateMandel();
}

function updateMandel() {
  background(0);
  loadPixels();

  let alpha = 255;
  const ITER = 1000;

  let n_ = ITER + 1;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let a = map(x, 0, width, minX - zoom / 2, minX + zoom / 2);
      let b = map(y, 0, height, minY - zoom / 2, minY + zoom / 2);

      let a_ = a,
        b_ = b;
      let n = 0,
        z = 0;
      while (n < ITER) {
        let re = a * a - b * b;
        let im = 2 * a * b;
        a = re + a_;
        b = im + b_;
        if (abs(a + b) > 10) {
          break;
        }
        n++;
      }
      // if (n < n_) n_ = n;
      alpha = map(n, 0, ITER, 0, 1);
      // alpha = map(sqrt(alpha), 0, 1, 0, 255);
      alpha_ = map(pow(alpha, 1 / 8), 0, 1, 0, 0xFFF);
      var pixel = (x + y * width) * 4;
      if (n == ITER) { //alpha = 0;
        pixels[pixel + 0] = 0;
        pixels[pixel + 1] = 0;
        pixels[pixel + 2] = 0;
        pixels[pixel + 3] = 255;
      } else {
        pixels[pixel + 0] = ((alpha_ & 0xF00) / 256) % 16 * 16;
        pixels[pixel + 1] = (alpha_ & 0x0F0) / 16 % 16 * 16;
        pixels[pixel + 2] = (alpha_ % 16) * 16;
        pixels[pixel + 3] = 255;
      }
    }
  }
  // console.log(n_);
  updatePixels();
}

function mousePressed() {
  let x_ = map(mouseX, 0, width, minX - zoom / 2, minX + zoom / 2);
  let y_ = map(mouseY, 0, height, minY - zoom / 2, minY + zoom / 2);
  console.log(x_, y_);
  minX = x_;
  minY = y_;
  zoom /= 5;
  updateMandel();
}