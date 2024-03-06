const eC = {version: 'v0.1', release:'r0', date:'mar/24', owner: 'rky', code:'y2I', annee:'2024', maj:'mar/24'};
let mobile;
let DEBUG = false, VERBOSE = false, LOOP = false, DENSITE = false;

let startTime, endTime;
let particules =[];
let barycentres = [];
let delaunay;
let moto;

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
    moto = loadImage('./img/minip.jpg');
}

function windowResized() {
    // let m = min(innerHeight,innerWidth) * 0.92;
    // resizeCanvas(m-10,m-10);
}

function getVoronoi() {
       delaunay = new d3.Delaunay(convertPoints(particules)); 
}

function convertPoints(part) {
    let arr = [];
    for (p of part) {
        arr.push(p.pos.x, p.pos.y);
    }
    return arr;
}
function setup() {
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    // get les data =
    canvas = createCanvas(800,451); // mise en place du ratio 0.59
    canvas.parent("#canvas");
    rate = select("#rate");

    // windowResized();

    // for (let i=0;i<1000;i++) {
    //     particules.push( new Particule(random(width),random(height)));
    // }

    for (let i=0;i<10000;i++) {
        let x = random(width);
        let y = random(height);
        let couleur = moto.get(x,y);
        if (random(120) > brightness(couleur)) {
            particules.push( new Particule(x,y));
        } else { i--;}
    }

}


function draw() {
    background(255);
    rate.html(' Exécution en '+round(deltaTime)+' ms');

    fill("#63DAC5");noStroke();
    for (let p of particules) {
        // p.update();
        p.show();
    }

    stroke(255);strokeWeight(1);noFill();
    getVoronoi();
    // const {points,triangles} = delaunay;

    // for (let i=0;i<triangles.length;i+=3 ) {
    //     // fill(color(random(255),random(255),random(255)));
    //     const t0 = 2 * triangles[i + 0];
    //     const t1 = 2 * triangles[i + 1];
    //     const t2 = 2 * triangles[i + 2];
    //     // triangle(points[t0],points[t0+1],points[t1],points[t1+1],points[t2],points[t2+1]);
    // }

    const voronoi = delaunay.voronoi([0,0,width,height]);
    const polygones = voronoi.cellPolygons();
    const cells = Array.from(polygones);

    // stroke(0); noFill();strokeWeight(1);
    // for (let p of cells) {
    //     beginShape();
    //     for (let i=0;i<p.length;i++) {
    //         vertex(p[i][0],p[i][1]);
    //     }
    //     endShape();
    // }

    barycentres=[]
    for (let p of cells) {
        // barycentres.push(getBarycentre_v0(p));
        barycentres.push(getBarycentre(p));
        // noFill();
        // stroke(255,0,0); strokeWeight(3);
        // point(barycentre.x,barycentre.y);
    }

    for (let i=0;i<particules.length;i++) {
        particules[i].lerp(barycentres[i],0.1);
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


class Particule {
    constructor(x,y) {
        this.pos = createVector(x,y);
    }

    update() {
        this.pos.x += random(-3,3);
        this.pos.y += random(-3,3);
    }

    lerp(v,r) {
        this.pos.lerp(v,r);
    }

    show() {
        // fill("#63DAC5");noStroke();
        stroke(0); strokeWeight(3);
        point(this.pos.x, this.pos.y);
        // circle(this.pos.x,this.pos.y,3);
    }
}


function getBarycentre_v0(poly) {
    let barycentre = createVector(0,0);
    for (let i=0;i<poly.length;i++) {
        barycentre.x += poly[i][0];
        barycentre.y += poly[i][1];
    }
    barycentre.div(poly.length);
    return barycentre;
}

function getBarycentre(poly) {
    let aire = 0;
    let barycentre = createVector(0,0);
    for (let i = 0; i< poly.length ; i++) {
        let v0 = poly[i];
        let v1 = poly[(i+1)%poly.length];
        let inter =  v0[0]*v1[1] - v0[1]*v1[0];
        aire += inter;
        barycentre.x += (v0[0]+v1[0]) * inter;
        barycentre.y += (v0[1]+v1[1]) * inter;
    }
    aire /= 2;
    barycentre.div(6 * aire);
    return barycentre;
}