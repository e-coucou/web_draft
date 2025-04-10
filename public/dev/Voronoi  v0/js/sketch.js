const eC = {version: 'v0.1', release:'r0', date:'mar/24', owner: 'rky', code:'y2I', annee:'2024', maj:'mar/24'};
let mobile;
let DEBUG = false, VERBOSE = false, LOOP = false, DENSITE = false;

let startTime, endTime;
let particules =[];
let barycentres = [];
let delaunay;
let img;
let sel_Choix, choix=0;
let sel_Image, choixImage='./img/joconde.jpg';
let imgOK = false;
let definition = 10000;

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
}

function loadFichier(fichier) {
    imgOK = false;
    img = loadImage(fichier, updateFichier);
}

function updateFichier() {
    windowResized();
    particules=[];
    barycentres=[];
    for (let i=0;i<definition;i++) {
        let x = random(width);
        let y = random(height);
        let couleur = img.get(x,y);
        if (random(95) > brightness(couleur)) {
            particules.push( new Particule(x,y));
        } else { i--;}
    }
    imgOK = true;
}

function windowResized() {
    // let m = min(innerHeight,innerWidth) * 0.92;
    resizeCanvas(img.width,img.height);
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

function selChoix(evt) {
    choix=int(sel_Choix.value());
}

function selImage(evt) {
    choixImage= sel_Image.value();
    loadFichier(choixImage);
}

function setup() {
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    // get les data =
    canvas = createCanvas(334,319); // mise en place du ratio 0.59
    canvas.parent("#canvas");
    rate = select("#rate");
    sel_Choix = select("#id_choix");
    sel_Choix.changed(selChoix);
    sel_Image = select("#id_image");
    sel_Image.changed(selImage);

    // for (let i=0;i<1000;i++) {
    //     particules.push( new Particule(random(width),random(height)));
    // }
    loadFichier(choixImage);

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

    const voronoi = delaunay.voronoi([0,0,width,height]);
    const polygones = voronoi.cellPolygons();
    const cells = Array.from(polygones);

    if (imgOK) {
        if (choix<=1 & choix!=4) {
            strokeWeight(1);
            if (choix==1) { noStroke();} else {stroke(0);}
            let i=0;
            for (let p of cells) {
                fill(particules[i].couleur);
                beginShape();
                for (let i=0;i<p.length;i++) {
                    vertex(p[i][0],p[i][1]);
                }
                endShape();
                i++;
            }
        }

        switch(choix) {
            case 0 :
                for (p of particules) { p.couleur=color(255);}
                for (let p of cells) {
                    barycentres.push(getBarycentre(p));
                }
                break;
            case 1:
                barycentres = getStippling(cells.length);
                break;
            case 2 :
                for (p of particules) { p.couleur=color(0);}
                for (let p of cells) {
                    barycentres.push(getBarycentre_v0(p));
                }
                break;
            case 3 :
                const {points,triangles} = delaunay;
                // fill(0);
                stroke(0);
                strokeWeight(1);

                for (let i=0;i<triangles.length;i+=3 ) {
                    fill(color(random(130,140),random(150,200),random(80,90)));
                    const t0 = 2 * triangles[i + 0];
                    const t1 = 2 * triangles[i + 1];
                    const t2 = 2 * triangles[i + 2];
                    triangle(points[t0],points[t0+1],points[t1],points[t1+1],points[t2],points[t2+1]);
                }
                break;
            case 4 :
                image(img,0,0);
                break;
        }

        for (let i=0;i<particules.length;i++) {
            particules[i].lerp(barycentres[i],0.1);
        }
    }

    textAlign(CENTER,CENTER);
    textSize(10); fill("#000000");noStroke();
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
        this.couleur = color(0,0,255);
    }

    update() {
        this.pos.x += random(-3,3);
        this.pos.y += random(-3,3);
    }

    lerp(v,r) {
        this.pos.lerp(v,r);
    }

    setColor(r,g,b) {
        this.couleur = color(r,g,b);
    }

    show() {
        // fill("#63DAC5");noStroke();
        stroke(this.couleur); strokeWeight(2);
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

function getStippling(nbCells) {
    let barycentres = new Array(nbCells);
    let poids = new Array(nbCells).fill(0);
    let couleurs = new Array(nbCells);
    for (let i=0;i<nbCells;i++) {
        barycentres[i] = createVector(0,0);
        couleurs[i] = new Couleur(0,0,0);
    }
    img.loadPixels()
    let delaunayIndex = 0;
    for (let i=0;i<width;i++) {
        for (let j=0;j<height;j++) {
            let id = (i+ j*width)*4;
            let r = img.pixels[id + 0];
            let g = img.pixels[id + 1];
            let b = img.pixels[id + 2];
            let luminance = (0.2126*r+0.7152*g+0.0722*b);
            let poid = (1 - luminance/255);
            delaunayIndex = delaunay.find(i,j, delaunayIndex);
            barycentres[delaunayIndex].x += poid * i;
            barycentres[delaunayIndex].y += poid * j;
            poids[delaunayIndex] += poid;

            couleurs[delaunayIndex].add(r,g,b);
        }
    }

    for (let i=0; i<nbCells ; i++) {
        particules[i].couleur = couleurs[i].getC();
        if (poids[i] != 0) {
            barycentres[i].div(poids[i]);
        } else barycentres[i] = particules[i].pos.copy();
    }

    return barycentres;
}

class Couleur {
    constructor(r,g,b) {
        this.n = 0;
        this.r = r;
        this.g = g;
        this.b = b;
    }

    add(r,g,b) {
        this.r += r;
        this.g += g;
        this.b += b;
        this.n += 1;
    }
    
    getC() {
        this.r /= this.n;
        this.g /= this.n;
        this.b /= this.n;
        return color(int(this.r), int(this.g), int(this.b));
    }
}