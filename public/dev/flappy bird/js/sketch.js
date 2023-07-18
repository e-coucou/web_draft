const TOTAL = 500;
let w,h;
let scene;
let generation;
let pipes=[];
let sliderCycle, sliderMutate;
let counter;
let maxScore;
let brainSaved;
let oiseau, soleil, wall, bck, poteau=[];
let Tektur;
let defile;
let mutateRate;

function preload() {
    brainSaved = loadJSON("./data/bestBird.json");
    wall = loadImage("./data/haut.png");
    oiseau = loadImage("./data/oiseau.png");
    soleil = loadImage("./data/soleil.png");
    poteau.push(loadImage("./data/poteau.png"));
    poteau.push(loadImage("./data/poteau2.png"));
    bck = loadImage("./data/bck_3.png");
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
    defile=0;
}

function setup() {
    canvas = createCanvas(innerWidth,innerHeight,WEBGL);
    canvas.parent('#canvas');
    windowResized();
    sliderCycle = createSlider(1,20,20);
    sliderMutate = createSlider(0.01,0.2,0.2,0.01);
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
    let cycles = sliderCycle.value();
    mutateRate = sliderMutate.value();
    let newG=false;
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
        newG = generation.update();
        if (newG) counter=0; // new gen
    }
    // background(162,247,255);  //bleu ciel
    translate(-width/2,-height/2);
    // image(bck,-width/100,-height/6);
    // image(bck,0,0,bck.width,height,100,0,width,2*height,100,0,width,height);
    defile++;
    image(bck,0,0,bck.width,height,defile%width,0,width,2*height); //,100,0,width,height);
    for (let p of pipes) {
        p.show();
    }
    generation.show();
    scene.show();
    if (generation.birds.length > 0 && !newG)
        {   
            // console.log(generation.birds.length);
            generation.birds[0].brain.render();
        }
    maxScore = max(maxScore,generation.maxScore);
    fill(0);
    textFont(Tektur);
    text("Gen: "+generation.gen,5,15);
    text(generation.birds.length+" / "+TOTAL,5,30);
    text(nf(generation.maxScore,0,0)+" / "+nf(maxScore,0,0),5,45);
    fill(255,0,0);
    text("#"+counter,5,60);
    fill(0,255,255);
    text("Speed: "+cycles,5,height-30);
    text("Mutate: "+nf(mutateRate,1,2),5,height-15);
}
