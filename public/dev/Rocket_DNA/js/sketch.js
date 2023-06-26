let nbR = 100;
let population;
let cible;
let cycle=0;
let life=300;
let cycleP;

function setup() {
    canvas = createCanvas(600,600);
    population = new Population(nbR);
    cible = createVector(width/2, 50);
    cycleP = createP("");
}


function draw() {
    background(0);
    population.run();
    cycle++;
    cycleP.html(cycle);

    if (cycle>life) {
        population.evaluation();
        population.selection();
        // population = new Population(nbR);
        cycle=0;
    }

    fill(0,200,0,180);
    circle(cible.x, cible.y,10);
}