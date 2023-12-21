const eC = {version: 'v0.1', release:'r0', date:'dec/23', owner: 'rky', code:'y2H', annee:'2023', maj:'dec/23'};
let mobile;
let DEBUG = false, VERBOSE = false, LOOP = false, DENSITE = false;

const cVert = [10,200,150];
let bgRate;

let germes=[], Nb=10;

function preload() { // voir getdata.js pour les preloads
    // dataJson = loadJSON('./data/dataEP.json');
}

function windowResized() {
    let m = min(innerHeight,innerWidth) * 0.92;
    resizeCanvas(m-10,m-10);
    bgRate = new barGraph(width-60,height-40,45,12,0,100);
}

function setup() {
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    // get les data =
    canvas = createCanvas(10,10); // mise en place du ratio 0.59
    canvas.parent("#canvas");
    rate = select("#rate");
    windowResized();

    for (let i=0; i<Nb; i++) {
        germes.push(new Vector(random(50,width-50),random(50,height-50),0));
    }
}

function draw() {
    background(0);
    rate.html(' Exécution en '+round(deltaTime)+' ms');
    fill(0); stroke(255);
    rect(50,50,width-100,height-100);

    fill(255);
    for (let g of germes) {
        circle(g.x(), g.y(),5);
    }

    textAlign(CENTER,CENTER);
    textSize(10); fill(color(cVert));noStroke();
    text('eCoucou '+eC.version, width-40, height-10);

    // textSize(12);textAlign(LEFT,CENTER);
    // let x = width-65, y= height-30;
    // etat = (!DEBUG?'🌐':'')+(FLAT?'⎯':'')+(RAINBOW?'🌈':'')+(btDensite.value?'👨‍👩‍👦‍👦':'');
    // text(etat,x,y);
    // text(searchInfo,7*width/8-55,3*height/4-7);

    bgRate.anim(deltaTime);
}