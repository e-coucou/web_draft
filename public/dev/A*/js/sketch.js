const eC = {version: 'v0.1', release:'r0', date:'dec/23', owner: 'rky', code:'y2H', annee:'2023', maj:'dec/23'};
let mobile;
let DEBUG = false, VERBOSE = false, LOOP = false, DENSITE = false;

const cVert = [10,200,150];
const cols=100, rows=cols;
let bgRate;
let grille=[];
let aStar;

function preload() { // voir getdata.js pour les preloads
}

function windowResized() {
    let m = min(innerHeight,innerWidth) * 0.92;
    resizeCanvas(m-10,m-10);
    const inc = width/(cols+2);
    for (let lignes of grille) {
        for (let c of lignes) {
            c.resize(inc);
        }
    }
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
    const inc = width/(cols);
    for (let i=0;i<cols;i++) {
        grille.push([]);
        for (let j=0;j<rows;j++) {
            grille[i].push(new Cell(i,j,inc));
        }
    }
    aStar = new Astar(grille[0][0], grille[cols-1][rows-1]);
    for (let lignes of grille) {
        for (let c of lignes) {
            c.voisin(grille);
        }
    }
}

function initQT(x1,x2,y1,y2) {
    nb=0;
	let boundary = new Rectangle(width/2, height/2, width/2, height/2);
	qt = new Quadtree(boundary, 4);
    let r =width/height;
    let offsetX = map((x2+x1)/2,x1,x2,0,width) / r;
    for (let i=0;i<villes.length;i++) {
        let v = villes[i];
        if (v.x>x1 & v.x<x2 & v.y>y1 & v.y<y2) {
            nb++;
            let info = new Info(v.hist,v.city,v);
            let x = map(v.x,x1,x2,0,width)/r + width/2 -offsetX;
            let y = map(v.y,y1,y2,height,0);
            let p = new Point(x, y, null, info);
            qt.insert(p);
        }
	}
}

function draw() {
    background(255);
    rate.html(' Exécution en '+round(deltaTime)+' ms');

    for (let lignes of grille) {
        for (let c of lignes) {
            c.show(color(255));
        }
    }

    aStar.show(color(cVert,color(255,0,0)));
    if (aStar.next()) {
        aStar.show(color(cVert,color(255,0,0)));
        noLoop();
    }

    if (VERBOSE) qt.show();

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