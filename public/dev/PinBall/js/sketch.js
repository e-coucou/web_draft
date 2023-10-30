const eC = {version: 'v0.01', release:'r0', date:'oct/23', owner: 'rky', code:'y2H', annee:'2023', maj:'oct/23'};
let mobile;
let b_canon=false;
let population;
let slider, rate;
let frein;

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
    slider = createSlider(0,10,9.99,0.1);
    slider.changed(perte);
    slider.parent("#slider");
    rate = select("#rate");
    frein = slider.value()/10;
    // frameRate(5);
}

function draw() {
    background(0);
    if (b_canon==true && (frameCount%3 ==0)) {
        for (let i=0; i<10;i++){
            population.canon(new Vector2(1.0,20-0.2*i), new Vector2(4,-2), color(120,255,255));
        }
    }
    population.update();
    rate.html('execution en '+round(deltaTime)+' ms'+'    Nombre de particules = '+population.particules.length);
    // noLoop();
    // population.show();
}