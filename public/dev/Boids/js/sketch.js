let boids = [];
const nbBoids = 100;

function setup() {
  canvas = createCanvas(400, 400);
  for (let i=0; i<nbBoids;i++) {
    boids.push(new Boid);
  }
}

function draw() {
  background(50);
  for (b of boids) {
    b.update();
    b.show();
  }
}
