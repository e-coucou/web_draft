const eC = {version: 'v2.40', release:'r1', date:'nov/23', owner: 'rky', code:'y2H', annee:'2023', maj:'nov/23'};
let mobile;
let DEBUG = true, VERBOSE = false, LOOP = false, DENSITE = false;

let btDensite;
let REDUC=800, RATIO=1.5;

const a1 = Math.log(33000);
const MIN_X= 100000, MAX_X = 1300000, MIN_Y=6001357, MAX_Y = 7191821;
// const ratio = 0.15402190211273947;

let villes = [], URLs=[], dataVilles, dataJson, villesNew = []
let iter=0;
let qt, nb=0, bgRate;
// let france=[];
// let municipalities = [];
let min_, max_;
let zoom = [ 55, 34, 21, 13, 8, 5, 3, 2], zoomId=0;
// let listId = 0, villesSel=0,
let selectRange = false, selectFix=false, [selX,selY] = [0,0];

let Annee, Departements, Zipf, Details, ListeVille, listeHelp, Search;
let cVert = [10, 200, 150];

let HELP = ['h: Help', 'd: debug', 'l: pas à pas', 'b: animation boucle', 'v: verbose', 'z/Z: Zoom +/-', 'd: gradient de densité', '0: France'];

function preload() { // voir getdata.js pour les preloads
    dataJson = loadJSON('./data/dataEP.json');
}

function windowResized() {
    let m = min(innerHeight,innerWidth);
    resizeCanvas(innerWidth-10,innerHeight-70);
    Search.position(7*width/8-20,3*height/4+20);
    Search.size(width/8);
    Search.class("styled");
    Init();
}

function addDept() {
    let dept = [];
    let regions = [];
    for (let i=0; i<villes.length;i++) {
        let v = villes[i];
        let c = v.context.split(', ');
        v['codeDept'] = (c[0]);
        v['dept'] = c[1];
        v['region'] = c[2];
        v['couleur'] = color(255,255,255);
        v['sel'] = 0;
        dept[c[0]] = c[1];
        let rID = regions.findIndex(a => a.n==c[2]) ;
        if ( rID== -1) {
            let d=[c[0]];
            regions.push({n:c[2], d:d});
        } else {
            let dID = regions[rID].d.findIndex(a => a==c[0] );
            if ( dID == -1) {
                regions[rID].d.push(c[0]);
            }
        }
    }
    return [dept, regions];
}

function selDept(code,liste) {
    let sum=0, nb=0;
    let sumR=0, nbR=0;
    villes.forEach( e => { 
        if (e.codeDept==code) {
            e.couleur = color(0,255,0);
            e.sel = 1;
            sum += e.hist[Annee.Id];
            nb++;
        } else {
            let f =-1;
            if (liste.length>0) f = liste.findIndex(a=>a==e.codeDept);
            if (f == -1) {
                e.couleur = color(255);
                e.sel = 0;
            } else {
                e.couleur = color(240,240,0);
                e.sel=1;
            }
        }
        if (code==0) {
            sum += e.hist[Annee.Id];
            nb++;
        }
    });
    return [sum, nb];
}

function Init() {
    villes = Object.values(dataJson);
    let [dept,regions] = addDept();
    let r = width/height;
    initQT(MIN_X,MAX_X ,MIN_Y,MAX_Y);
    Departements = new Departement(7*width/8-20,height/4,width/8,height/4, dept, regions);
    Zipf = new ZIPF(3*width/4,10,width/4,height/5);
    Zipf.setVilles(0,villes);
    Details = new Detail(170,10,100,100);
    Details.setValues(villes[0].hist);
    btDensite = new Button(width-65,height-60,50,25);
    bgRate = new barGraph(width-65,height-80,50,12,0,150);
    ListeVille = new LISTE(0,175,200,height-175-50);
    listeHelp = new LISTE(width-180,height-50,200,15,HELP);
    drawMunipPrev(MIN_X,MAX_X,MIN_Y,MAX_Y);
    Annee.setAnnee(2020);
}

function setup() {
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    // get les data =
    canvas = createCanvas(10,10); // mise en place du ratio 0.59
    canvas.parent("#canvas");
    rate = select("#rate");
    Search = createInput('');
    Search.changed(searchVilles);
    // ajouter les getdata depuis getdata.js pour reprendre les données depuis data ou site gouv
    Annee = new Annees();
    windowResized();
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

function getCircle(v) {
    return max(1,Math.log(v/REDUC)*RATIO);
}

function drawMunipPrev(x1,x2,y1,y2) {
    let r = width/height;
    let offsetX = map((x2+x1)/2,x1,x2,0,width) / r;
    for (let i=0;i<villes.length;i++) {
        let v = villes[i];
        if (v.x>x1 & v.x<x2 & v.y>y1 & v.y<y2) {
            let x = map(v.x,x1,x2,0,width) / r + width/2 - offsetX;
            // let x = map(v.x,x1,x2,0,width) + (width/2-offsetX/2)/2;
            let y = map(v.y,y1,y2,height,0);
            v['display'] = {x:x,y:y};
            let d = ((v.hist[v.hist.length-1]-v.hist[0])/v.hist[0] + 1.0)*100;
            v['densite'] = d;
        }
    }
}
function drawMunicipalite(x1,x2,y1,y2,ref) {
    let r=width/height;
    let ok = Annee.getOK();
    noStroke();
    for (let i=0;i<villes.length;i++) {
        let v = villes[i];
        fill(v.couleur);
        if (v.x>x1 & v.x<x2 & v.y>y1 & v.y<y2) {
            let pop = v.hist[ref];
            if (ok ==-1) {
                fill(120);
                let d = Annee.getDelta(ref);
                let r = Annee.iter/d;
                let pop2 = v.hist[ref+1];
                delta =  (pop2-pop) * r;
                pop += delta;
            }
            if (btDensite.value) {
                fill(btDensite.couleur(v.densite));
            }
            let c = getCircle(pop);
            if (v.sel == 2) {fill(v.couleur);c=10}
            circle(v.display.x,v.display.y,c);
        }
    }
    // DEBUG INFO
    // let offsetX = map((x2+x1)/2,x1,x2,0,width);
    // let x = map(MIN_X,x1,x2,0,width) + (width/2-offsetX/2)/2;
    // // let y = map(v.y,y1,y2,height,0);
    // fill(255,0,0);
    // circle(x,500,10);
    // x = map(1300000,x1,x2,0,width) + (width/2-offsetX/2)/2;
    // circle(x,500,10);
    // console.log(offsetX)
}

function getMinMax() {
    let min_=[Infinity,Infinity], max_ =[0,0];
    for (let i=0;i<villes.length;i++) {
        let v = villes[i];
        let x = v.x;
        let y = v.y;
        if (x < min_[0]) min_[0] = x;
        if (y < min_[1]) min_[1] = y;
        if (x > max_[0]) max_[0] = x;
        if (y > max_[1]) max_[1] = y;
    }
    return [min_,max_];
}

function villeVariation() {
    let villesVar = [];
    for (let v of villes) {
        let x = 1;
    }
}

function drawPoints(points, range, zR, d_) {
    let res= d_;
    // villesSel = points.length;
    ListeVille.setListe(points);
    // listId = max(0,min(listId,villesSel-1));
    if (points.length>0) Zipf.setFocus(points[ListeVille.sel].info.data.id);
	for (let i=0;i<points.length;i++) {
        let p = points[i];
		// point(p.x, p.y);
        // fill(10, 200, 150);
        fill(color(cVert));
        noStroke();
        strokeWeight(1);
        let k=1;
        switch(p.info.data.sel) {
            case 2: k=3;
            case 1:  { fill(p.info.data.couleur); stroke(p.info.data.couleur); }          
        }
        // if (p.info.data.sel >= 1) { fill(p.info.data.couleur); stroke(p.info.data.couleur); }
        if( btDensite.value) fill(btDensite.couleur(p.info.data.densite));
        if (i==ListeVille.sel) {fill(255); k=2 ;}
        let c = getCircle(p.info.hist[Annee.Id]);
        circle(75+(p.x-range.x)*zR,75+(p.y-range.y)*zR, 2*c*k);
        circle(p.x,p.y,c*k);
        res += p.info.hist[Annee.Id];
	}
    return (res);    
}
function draw() {
    background(0);
    // [min_, max_] = getFrance();
    // drawVilles(min_, max_);
    // let [[minX,minY],[maxX,maxY]] = getMinMax();
    let r = width/height;
    // let sum = 0;
    // villes.forEach(a=>{ sum += a.hist[Annee.Id];});
    rate.html(' Exécution en '+round(deltaTime)+' ms');
    // rate.html('execution en '+round(deltaTime)+' ms'+'    Année = '+Annee.annee+' -  pop= '+sum);
    if (DEBUG) noLoop();
    drawMunicipalite(MIN_X, MAX_X , MIN_Y,MAX_Y,Annee.Id);

    if (VERBOSE) qt.show();
    if (LOOP) Annee.nextYear();

    //get regions/dept
    let gR = new Rectangle(mouseX,mouseY,3,3);
    let pt = qt.query(gR);
    if (pt.length >0) {
        let dpt = pt[0].info.data.codeDept;
        Departements.setFocus(dpt);
    }

    selectRange = Annee.getSlider(mouseX,mouseY) | Departements.getSel(mouseX,mouseY) | btDensite.getOK(mouseX,mouseY) | ListeVille.getSel(mouseX, mouseY) | getOkDivers(mouseX,mouseY);

    if (!selectRange | selectFix) {
        stroke(color(cVert));
        fill(0);
        rectMode(CENTER);
        if (!selectFix) { [selX,selY] = [mouseX,mouseY];}
        let range = new Rectangle(selX, selY, zoom[zoomId], zoom[zoomId]);
        rect(range.x, range.y, range.w * 2, range.h * 2);
        rect(75,75,150,150);
        let zR = 75/zoom[zoomId];
        let points = qt.query(range);
        textAlign(LEFT,CENTER);
        let densite = drawPoints(points,range,zR, 0);

        textSize(12); fill(255);noStroke();
        text('# de Communes : '+points.length, 10, height-30);
        text('Densité : '+densite, 10, height-15);
    }

    Annee.show();
    Departements.show();
    Zipf.show();
    Details.show();
    btDensite.show();
    ListeVille.show();
    textAlign(CENTER,CENTER);
    textSize(10); fill(color(cVert));noStroke();
    text('eCoucou '+eC.version, width-40, height-10);
    textSize(32);
    text('FRANCE', width/2, 22);
    textSize(9);
    text('d/l/b/v/zZ/g/0/⬆️⬇️/➡️⬅️', width-180, height-10);
    // listeHelp.show();
    bgRate.anim(deltaTime);
}