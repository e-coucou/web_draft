const eC = {version: 'v0.1', release:'r0', date:'mar/24', owner: 'rky', code:'y2I', annee:'2024', maj:'mar/24'};
let mobile;
let DEBUG = false, VERBOSE = false, LOOP = false, DENSITE = false;

let startTime, endTime;
let Seedpoints =[];
let delaunay;

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
}

function windowResized() {
    let m = min(innerHeight,innerWidth) * 0.92;
    resizeCanvas(m-10,m-10);
}

function setup() {
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    // get les data =
    canvas = createCanvas(10,10); // mise en place du ratio 0.59
    canvas.parent("#canvas");
    rate = select("#rate");

    windowResized();

    for (let i=0;i<100;i++) {
        Seedpoints.push( createVector(random(width),random(height)))
    }

    delaunay = new d3.Delaunay(convertD3(Seedpoints));

}


function draw() {
    background(0);
    rate.html(' Exécution en '+round(deltaTime)+' ms');

    fill("#63DAC5");noStroke();
    for (let p of Seedpoints) {
        circle(p.x,p.y,3);
    }

    stroke(255);strokeWeight(1);
    const {points,triangles} = delaunay;

    for (let i=0;i<triangles.length;i+=3 ) {
        fill(color(random(255),random(255),random(255)));
        const t0 = 2 * triangles[i + 0];
        const t1 = 2 * triangles[i + 1];
        const t2 = 2 * triangles[i + 2];
        triangle(points[t0],points[t0+1],points[t1],points[t1+1],points[t2],points[t2+1]);
    }

    textAlign(CENTER,CENTER);
    textSize(10); fill("#ffffff");noStroke();
    text('eCoucou '+eC.version, width-40, height-10);

}

function convertD3(points) {
    let arr=[];
    for (let p of points) {
        arr.push(p.x, p.y);
    }
    return arr;
}