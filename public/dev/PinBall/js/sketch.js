const eC = {version: 'v0.01', release:'r0', date:'oct/23', owner: 'rky', code:'y2H', annee:'2023', maj:'oct/23'};
let mobile;
let b_canon=false;
let population;
let slider, rate;
let frein;
let DEBUG = true;

function windowResized() {
    let m = min(innerHeight,innerWidth);
    let w_ = int(m*0.8);
    resizeCanvas(innerWidth-10,w_);
    initSim();
}

function keyPressed() {
    if (key=='s') {
        b_canon =  !b_canon;
    }
    if (key=='l') {
        loop();
    }
    if (key=='d') {
        DEBUG = ! DEBUG;
    }
}

function perte() {
    frein = slider.value()/10;
}

function setup() {
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    canvas = createCanvas(10,10); // mise en place du ratio 0.59
    canvas.parent("#canvas");
    windowResized();
    population = new Population(0);
    // population.particules[0].pos = new Vector2(1,5);
    // population.particules[0].vel = new Vector2(4,2);
    // population.particules[0].masse = 100;
    // population.particules[0].rayon = 100/2/scale;
    // population.particules[0].color = color(120,255,255);
    // population.particules[1].pos = new Vector2(15,5);
    // population.particules[1].vel = new Vector2(-5,3);
    // population.particules[1].masse = 100;
    // population.particules[1].rayon = 100/2/scale;
    // population.particules[1].color = color(120,255,120);
    slider = createSlider(0,10,9.99,0.1);
    slider.changed(perte);
    slider.parent("#slider");
    rate = select("#rate");
    frein = slider.value()/10;
    // frameRate(5);
    noLoop();
}

function draw() {
    background(0);
    if (b_canon==true && (frameCount%1 ==0)) {
        for (let i=0; i<10;i++){
            population.canon(new Vector2(15.0,10-0.05*i), new Vector2(-5,1), color(120,255,255));
        }
    }
    population.update();
    population.edge();
    // population.debug();
    rate.html('execution en '+round(deltaTime)+' ms'+'    Nombre de particules = '+population.particules.length);
    if (DEBUG) noLoop();
    // population.show();
}