let canvas;

let emetteurs = [];
let gravity;

function mousePressed() {
    emetteurs.push(new Emetteur(mouseX,mouseY));
}

function setup() {
    canvas = createCanvas(600, 400);
    canvas.parent('sketch-XXX');
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log(position);
          });
    } else {
    console.log('Géolocalisation on disponible');
    }
    gravity = createVector(0,0.05);
    colorMode(HSB);
}

function draw() {
    background(0);


    for (let e of emetteurs) {
        if( e.life> 150) e.emet(5);
        e.update();
        e.show();
    }

    emetteurs = emetteurs.filter(e=> e.isAlive());

}