const eC = {version: 'v0.1', release:'r0', date:'dec/23', owner: 'rky', code:'y2H', annee:'2023', maj:'dec/23'};
let mobile;
let DEBUG = false, VERBOSE = false, LOOP = false, DENSITE = false;

const cVert = [10,200,150];
const offset = 50;
let bgRate;

let voronoi, Nb=1, D = 0;

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

    voronoi = new Voronoi();

    voronoi.add(new Germe ( new Vector(width/2,200,0)) );
}

function mouseClicked() {
    voronoi.add(new Germe( new Vector(mouseX,mouseY, 0)) );
}

function draw() {
    background(0);
    D = mouseY;
    rate.html(' Exécution en '+round(deltaTime)+' ms');
    fill(0); stroke(255);
    rect(offset,offset,width-2*offset,height-2*offset);

    stroke(255); strokeWeight(2);
    line(offset,D,width-offset,D);


    voronoi.update(D);
    voronoi.show(D);

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