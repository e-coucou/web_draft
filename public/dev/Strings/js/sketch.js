let bob=[];
let bobs = [];
let espace=5;
let springs = [];
let gravite;
let k = 0.1;
let nb=40;

function setup() {
  createCanvas(400, 400);
  for (let j=0; j<nb; j++) {
    for (let i=0; i<nb ; i++) {
      bob.push(new Particule(j*espace+100, espace * i ));
      if (i!= 0) {
        let id = i + j*nb;
        springs.push(new Spring(k, espace, bob[id-1], bob[id]));
      }
      if (j!= 0) {
        let id0 = i + j*nb;
        let id1 = i + (j-1)*nb;
        springs.push(new Spring(k, espace, bob[id1], bob[id0]));
      }
    }
    bob[j*nb].verrou = true;
  }
  gravite = createVector(0,0.006);
}

function draw() {
  background(220);
  for (s of springs) {
    s.show();

    s.update();
  }
  for (b of bob) {
    // b.show();
    b.applyForce(gravite);
    b.update();
  }

  let tail = bob[bob.length-1];

  if (mouseIsPressed) {
    tail.pos.x = mouseX;
    tail.pos.y = mouseY;
  }
}
