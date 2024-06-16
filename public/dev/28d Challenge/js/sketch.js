const eC = {version: 'v0.1', release:'r0', date:'june/24', owner: 'rky', code:'y2I', annee:'2024', maj:'june/24'};
let mobile;
let DEBUG = false, VERBOSE = false, LOOP = false, DENSITE = false;

let startTime, endTime;
let programme, fCSV;

function start() {
    startTime = new Date();
}
function end() {
    endTime = new Date();
    return (endTime-startTime);
}

function preload() {
    // voir getdata.js pour les preloads
    // dataJson = loadJSON('./data/dataEP.json');
    // img = loadImage('./img/joconde.jpg');
    fCSV = loadTable('./data/programme.csv','csv');
}


function windowResized() {
    let m = min(innerHeight,innerWidth) * 0.92;
    resizeCanvas(m,m);
}

function setup() {
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    // get les data =
    canvas = createCanvas(1,1); // mise en place du ratio 0.59
    canvas.parent("#canvas");
    rate = select("#rate");
    vx=select("#vx"); vx.html('⌖ '+eC.version+' '+eC.release+' >'+eC.maj+'<');
    cr=select("#cr"); cr.html('(ツ) © eCoucou '+eC.annee);
    windowResized();

    programme = [];
    for (let i=0; i<fCSV.getRowCount(); i++) {
        programme.push(fCSV.getString(i,1));
    }

}

function mouse_(x,y) {
}
function touchStarted() {
    mouseSelection=true;
    let fs =fullscreen();
    // console.log(fs);
    // if (!fs) { fullscreen(true);}
    mouse_(touches[0].x, touches[0].y);
}

// function mousePressed() {
//     mouse_();
// }
function mouseClicked() {
    mouse_(mouseX,mouseY);
}


function draw() {
    background(0);
    rate.html(' Exécution en '+round(deltaTime)+' ms');

    textAlign(CENTER,CENTER);
    textSize(10); fill("#000000");noStroke();
    text('eCoucou '+eC.version, width-40, height-10);

// noLoop();
}