 let canvas;

 let gravity;
 let emetteurs = [];

 let x, y, r = 300,
     phi;

 function mousePressed() {
     emetteurs.push(new Emetteur(mouseX, mouseY));
 }

 function setup() {
     canvas = createCanvas(600, 400);
     canvas.parent('sketch-XXX');
     gravity = createVector(0, 0.15);
     colorMode(HSB);
     phi = -PI / 5;
 }

 function draw() {
     background(0);

     if (phi >= -3 * PI / 4 && frameCount % 10 === 0) {
         phi -= PI / 25;
         x = r * cos(phi) + width / 2;
         y = r * sin(phi) + height;
         emetteurs.push(new Emetteur(x, y));
     }

     for (let e of emetteurs) {
         if (e.life < 200 && frameCount % 12 === 0) e.emet(floor(e.life / 50));
         e.update();
         e.show();
     }

     emetteurs = emetteurs.filter(e => e.isAlive());

 }