const eC = {version: 'v0.2', release:'r0', date:'dec/23', owner: 'rky', code:'y2H', annee:'2023', maj:'dec/23'};
let mobile;
let DEBUG = false, VERBOSE = false, LOOP = false, DENSITE = false;

const cVert = [10,200,150];
const offset = 50;
let bgRate;

let iter = 0;

let voronoi, Nb=1, D = 0;

let test;

let startTime, endTime;

function start() {
    startTime = new Date();
}
function end() {
    endTime = new Date();
    return (endTime-startTime);
}

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
    test = new CercleCirc();

    // voronoi.add(new Germe ( new Vector(width/2-15,120,0)) );
    // voronoi.add(new Germe ( new Vector(width/4-35,70,0)) );
    // voronoi.add(new Germe ( new Vector(3*width/4-5,380,0)) );

    voronoi.add(new Germe ( new Vector(width/2-15,height/4-10,0)) );
    voronoi.add(new Germe ( new Vector(width/2+10,height/2+20,0)) );
    voronoi.add(new Germe ( new Vector(width/2,3*height/4,0)) );
    voronoi.add(new Germe ( new Vector(width/4-35,height/4+30,0)) );
    voronoi.add(new Germe ( new Vector(width/4+40,height/2-20,0)) );
    voronoi.add(new Germe ( new Vector(width/4-34,3*height/4+23,0)) );
    voronoi.add(new Germe ( new Vector(3*width/4-5,height/4+21,0)) );
    voronoi.add(new Germe ( new Vector(3*width/4-12,height/2+2,0)) );
    voronoi.add(new Germe ( new Vector(3*width/4+14,3*height/4-23,0)) );

    // for (let i =0; i<10 ; i++) {
    //     voronoi.add(new Germe ( new Vector(random(offset+10,width-10-offset),random(10+offset,height-10-offset),0)) );
    // }
    // drawVoronoi_Calcul();
}

function mouseClicked() {
    voronoi.add(new Germe( new Vector(mouseX,mouseY, 0)) );
    // drawVoronoi_Calcul();
    // test.add(mouseX,mouseY);

}

function drawVoronoi() {
    start();
    sites = [];
    for (let i=0; i<height ; i++) {
        for (let A = 0.0; A<1 ; A += 0.05) {
            D = i + A;
            // voronoi.update(D);
            // voronoi.show(D);
            voronoi.balayage(D);
            // voronoi.draw();
    
        }    
    }
    console.log(end());
}
function drawVoronoi_Calcul() {
    start();
    sites = [];
    for (let i=0; i<1000 ; i++) {
        for (let A = 0.0; A<1 ; A += 0.5) {
            D = i + A;
            voronoi.update(D);   
        }    
    }
    // voronoi.showEtat(D);
    // voronoi.show();
    console.log(end());

}function draw() {
    background(0);
    rate.html(' Exécution en '+round(deltaTime)+' ms');
    fill(0); stroke(255);
    rect(offset,offset,width-2*offset,height-2*offset);

    D = mouseY;
    // iter += 2;
    stroke(255); strokeWeight(2);
    line(offset,D,width-offset,D);

    // voronoi.draw();
    voronoi.update(D);
    voronoi.showEtat(D);

    voronoi.show();
    // voronoi.germesShow();

    test.draw(mouseX,mouseY);

    textAlign(CENTER,CENTER);
    textSize(10); fill(color(cVert));noStroke();
    text('eCoucou '+eC.version, width-40, height-10);

    // textSize(12);textAlign(LEFT,CENTER);
    // let x = width-65, y= height-30;
    // etat = (!DEBUG?'🌐':'')+(FLAT?'⎯':'')+(RAINBOW?'🌈':'')+(btDensite.value?'👨‍👩‍👦‍👦':'');
    // text(etat,x,y);
    // text(searchInfo,7*width/8-55,3*height/4-7);

    bgRate.anim(deltaTime);
    // if (iter>1000) {
    //     iter=0;
    //     sites = [];
    // }
}