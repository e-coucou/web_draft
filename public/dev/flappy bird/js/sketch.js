const TOTAL = 500;
let w,h;
let scene;
let generation;
let pipes=[];
let slider;
let counter;
let maxScore;
let brainSaved;
let oiseau, soleil, wall, bck;
let Tektur;

function preload() {
    brainSaved = loadJSON("./data/bestBird.json");
    wall = loadImage("./data/arbre.jpg");
    oiseau = loadImage("./data/oiseau.png");
    soleil = loadImage("./data/soleil.png");
    bck = loadImage("./data/bck_1.jpg");
    Tektur = loadFont("../../font/Tektur-VariableFont_wdth,wght.ttf")
}

function restoreBrain() {
    let brain = NeuralNetwork.deserialize(brainSaved);
    let bird = new Bird(brain);
}

function windowResized() {
    h =min(windowHeight,500);
    resizeCanvas(innerWidth,h);
    generation = new GA(TOTAL);
    counter=0;
    maxScore=0;
    pipes=[];
    pipes.push(new Pipe);
    scene = new Scene();
}

function setup() {
    canvas = createCanvas(innerWidth,innerHeight,WEBGL);
    canvas.parent('#canvas');
    windowResized();
    slider = createSlider(1,20,1);
    textFont("Tektur");
    textAlign(LEFT, CENTER);
    textSize(12);
}

function keyPressed() {
    // if (key==' ') {
    //     bird.up();
    // }
    if (key=='s') {
        saveJSON(generation.bestBird, 'bestBird.json');
    }
}

function draw() {
    let cycles = slider.value();
    for (let c=0; c<cycles; c++) {
        counter++;
        if (counter % 100 == 0) {
            pipes.push(new Pipe);
        }

        for (let i=pipes.length-1;i>0; i--) {
            let pipe = pipes[i];
            pipe.show();
            if ( pipe.update()) {
                pipes.splice(i,1);
            }
        }
        if (generation.update()) counter=0; // new gen
    }
    // background(162,247,255);  //bleu ciel
    translate(-width/2,-height/2);
    image(bck,-width/8,-3*height/4);
    for (let p of pipes) {
        p.show();
    }
    generation.show();
    scene.show();
    maxScore = max(maxScore,generation.maxScore);
    fill(0);
    textFont(Tektur);
    text("Gen: "+generation.gen,5,15);
    text(generation.birds.length+" / "+TOTAL,5,30);
    text(nf(generation.maxScore,0,0)+" / "+nf(maxScore,0,0),5,45);
    fill(255,0,0);
    text("#"+counter,5,60);
}
