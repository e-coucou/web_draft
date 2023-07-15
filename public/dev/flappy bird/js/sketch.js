const TOTAL = 500;
let w,h;
let generation;
let pipes=[];
let slider;
let counter;
let maxScore;

function windowResized() {
    h =min(windowHeight,500);
    resizeCanvas(innerWidth,h);
    generation = new GA(TOTAL);
    counter=0;
    maxScore=0;
    pipes=[];
    pipes.push(new Pipe);
}

function setup() {
    canvas = createCanvas(innerWidth,innerHeight);
    canvas.parent('#canvas');
    windowResized();
    slider = createSlider(1,20,1);
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
        generation.update();
    }
    background(0);
    for (let p of pipes) {
        p.show();
    }
    generation.show();
    maxScore = max(maxScore,generation.maxScore);
    fill(255);
    text("Gen: "+generation.gen,5,15);
    text(nf(generation.maxScore,0,0)+" / "+nf(maxScore,0,0),5,30);
    text(generation.birds.length+" / "+TOTAL,5,45);
}
