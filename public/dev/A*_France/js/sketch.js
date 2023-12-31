const eC = {version: 'v0.1', release:'r0', date:'dec/23', owner: 'rky', code:'y2H', annee:'2023', maj:'dec/23'};
let mobile;
let DEBUG = false, VERBOSE = false, LOOP = false, DENSITE = false;

const cVert = [10,200,150];
const cols=100, rows=cols;
let bgRate,qt;
let aStar;


function preload() { // voir getdata.js pour les preloads
    dataJson = loadJSON('./data/dataEP.json');
}

function windowResized() {
    let m = min(innerHeight,innerWidth) * 0.92;
    resizeCanvas(m-10,m-10);
    bgRate = new barGraph(width-60,height-40,45,12,0,100);
    villes = Object.values(dataJson);
    initQT(MIN_X,MAX_X ,MIN_Y,MAX_Y);
}

function setup() {
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    // get les data =
    canvas = createCanvas(10,10); // mise en place du ratio 0.59
    canvas.parent("#canvas");
    rate = select("#rate");
    windowResized();
    Annee = new Annees();
    drawMunipPrev(MIN_X,MAX_X,MIN_Y,MAX_Y);
    Annee.setAnnee(2020);
    for (let pt of villes) {
        let inc=3;
        let gR = new Rectangle(pt.display.x,pt.display.y,inc,inc);
        let voisins = qt.query(gR);
        while (voisins.length < 5) {
            inc += 1;
            gR = new Rectangle(pt.display.x,pt.display.y,inc,inc);
            voisins = qt.query(gR);
        }
        pt.f = 0;
        pt.g = 0;
        pt.h = 0;
        pt.precedent = undefined;
        pt.voisins = voisins;
    }
    start = searchVilles('corps-nu');
    // start = searchVilles('paris 15e');
    // start = searchVilles('lyon 6e');
    // start = searchVilles('dompierre-sur-besbre');
    end = searchVilles('saint-tropez');
    aStar = new Astar(start,end);
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
            let p = new Point(x, y, v, info);
            qt.insert(p);
        }
	}
}

function draw() {
    background(0);
    rate.html(' Exécution en '+round(deltaTime)+' ms');

    drawMunicipalite(MIN_X, MAX_X , MIN_Y,MAX_Y,Annee.Id); 

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