const eC = {version: 'v2.00', release:'r1', date:'nov/23', owner: 'rky', code:'y2H', annee:'2023', maj:'nov/23'};
let mobile;
let DEBUG = true, VERBOSE = false, LOOP = false, DENSITE = false;

let btDensite;

const a1 = Math.log(33000);
const MIN_X= 0, MAX_X = 1438080, MIN_Y=6001357, MAX_Y = 7191821;
const ratio = 0.15402190211273947;

let villes = [], URLs=[], dataVilles, dataJson, villesNew = []
let iter;
let qt, nb=0;
// let france=[];
// let municipalities = [];
let min_, max_;
let zoom = [ 55, 34, 21, 13, 8, 5, 3, 2], zoomId=0;
let listId = 0, villesSel=0, selectRange = false, selectFix=false, [selX,selY] = [0,0];

let Annee, Departements, Zipf, Details;
let cVert = [10, 200, 150];

function preload() {
    // france.push(loadTable('./data/1968.csv','ssv','header'));
    // france.push(loadTable('./data/1975.csv','ssv','header'));
    // france.push(loadTable('./data/1982.csv','ssv','header'));
    // france.push(loadTable('./data/1990.csv','ssv','header'));
    // france.push(loadTable('./data/1999.csv','ssv','header'));
    // france.push(loadTable('./data/2006.csv','ssv','header'));
    // france.push(loadTable('./data/2007.csv','ssv','header'));
    // france.push(loadTable('./data/2008.csv','ssv','header'));
    // france.push(loadTable('./data/2009.csv','ssv','header'));
    // france.push(loadTable('./data/2010.csv','ssv','header'));
    // france.push(loadTable('./data/2011.csv','ssv','header'));
    // france.push(loadTable('./data/2012.csv','ssv','header'));
    // france.push(loadTable('./data/2013.csv','ssv','header'));
    // france.push(loadTable('./data/2014.csv','ssv','header'));
    // france.push(loadTable('./data/2015.csv','ssv','header'));
    // france.push(loadTable('./data/2016.csv','ssv','header'));
    // france.push(loadTable('./data/2017.csv','ssv','header'));
    // france.push(loadTable('./data/2018.csv','ssv','header'));
    // france.push(loadTable('./data/2019.csv','ssv','header'));
    // france.push(loadTable('./data/2020.csv','ssv','header'));
    // dataJson = loadJSON('./data/municipalites.json');
    dataJson = loadJSON('./data/dataEP.json');
    // france.push(loadTable('./data/2019.csv','ssv','header'));
}

function convertPublicData() {
    villesNew = [];
    for (let i=0;i<dataVilles.length;i++) {
        let v = dataVilles[i].features;
        if (v.length>0) {
            v=v[0];
            let p = v.properties;
            let seek = v.properties.id;
            let hPop = [];
            for (let i in historique) {
                // let h = historique[i];
                let result = france[i].rows.filter(a => { return a.arr[0]==seek;});
                if (result.length>0) {
                    pop = int(result[0].arr[2].replace(/\s/g,''));
                    hPop[i]=pop;
                }
            }
            if (hPop.length>0) {
                // console.log(result)
                villesNew.push( {geometry:v.geometry.coordinates,city:p.city,id:p.id, pop:p.population, hist:hPop,poscode:p.postcode, x:p.x, y:p.y,importance:p.importance,score:p.score,context:p.context } )
            }
        }
    }
}

function getFrance() {
    villes=[];
    let min_=Infinity, max_=0;
    for (let r of france[2].rows) {
        // console.log(r.obj)
        pop = int(r.obj.PMUN20.replace(/\s/g,''));
        libelle = r.obj.NCC;
        id = r.obj.COM;
        villes.push( pop);
        if (pop<min_) min_ = pop;
        if (pop>max_) max_ = pop;
        // if (nb<1) {
            url = 'https://api-adresse.data.gouv.fr/search/?q='+libelle+'&citycode='+id+'&type=municipality';
            URLs.push({id:id, lib:libelle, population:pop, url:url});
            // info = httpGet(url, 'json', (data)=> {
            //     municipalities.push(data);
            // });
        // }
        nb++;
    }
    villes.sort((a,b)=> {return (b-a);});
    return [min_, max_];
}

function windowResized() {
    let m = min(innerHeight,innerWidth);
    let w_ = int(m*0.8) - 10;
    resizeCanvas(innerWidth-10,innerHeight-80);
    let r = width/height;
    initQT(MIN_X,MIN_X + (MAX_Y-MIN_Y)*r,MIN_Y,MAX_Y);
}

function getData(num) {
    info = httpGet(URLs[num].url, 'json', (data)=> {
        municipalities.push(data);
    });
}

function addDept() {
    let dept = [];
    for (let i=0; i<villes.length;i++) {
        let v = villes[i];
        let c = v.context.split(', ');
        v['codeDept'] = (c[0]);
        v['dept'] = c[1];
        v['region'] = c[2];
        v['couleur'] = color(255,255,255);
        v['sel'] = 0;
        dept[c[0]] = c[1];
    }
    return dept;
}

function selDept(code) {
    let sum=0, nb=0;

    villes.forEach( e => { 
        if (e.codeDept==code) {
            e.couleur = color(255,255,0);
            e.sel = 1;
            sum += e.hist[Annee.Id];
            nb++;
        } else {
            e.couleur = color(255);
            e.sel = 0;
        }
        if (code==0) {
            sum += e.hist[Annee.Id];
            nb++;
        }
    });
    return [sum, nb];
}

function setup() {
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    // get les data =
    villes = Object.values(dataJson);
    let dept = addDept();
    canvas = createCanvas(10,10); // mise en place du ratio 0.59
    canvas.parent("#canvas");
    windowResized();
    rate = select("#rate");
    // Init(33000); // initialisation des communes de manière aléatoire
    // frameRate(3);
    // let min_, max_;
    // [min_, max_] = getFrance();
    // drawVilles(min_, max_);
    // dataVilles = Object.values(dataJson);
    Annee = new Annees();
    Departements = new Departement(7*width/8,180,width/8,height/4, dept);
    Zipf = new ZIPF(14*width/16-1,140/2-1,2*width/8,140);
    Zipf.setVilles(0,villes);
    Details = new Detail(170,10,100,100);
    Details.setValues(villes[0].hist);
    btDensite = new Button(width-65,height-60,50,25);
    let r = width/height;
    drawMunipPrev(MIN_X,MIN_X + (MAX_Y-MIN_Y)*r,MIN_Y,MAX_Y);
}

function initQT(x1,x2,y1,y2) {
    nb=0;
	let boundary = new Rectangle(width/2, height/2, width/2, height/2);
	qt = new Quadtree(boundary, 4);
    let offsetX = map((x2-x1)/2,x1,x2,0,width/2) /2;
    for (let i=0;i<villes.length;i++) {
        let v = villes[i];
        if (v.x>x1 & v.x<x2 & v.y>y1 & v.y<y2) {
            nb++;
            let info = new Info(v.hist,v.city,v);
            let x = map(v.x,x1,x2,0,width) +offsetX;
            let y = map(v.y,y1,y2,height,0);
            let p = new Point(x, y, null, info);
            qt.insert(p);
        }
	}
}

function getCircle(v) {
    return max(1,Math.log(v/800)*1.5);
}

function drawMunipPrev(x1,x2,y1,y2) {
    let offsetX = map((x2-x1)/2,x1,x2,0,width/2) /2;
    for (let i=0;i<villes.length;i++) {
        let v = villes[i];
        if (v.x>x1 & v.x<x2 & v.y>y1 & v.y<y2) {
            let x = map(v.x,x1,x2,0,width) +offsetX;
            let y = map(v.y,y1,y2,height,0);
            v['display'] = {x:x,y:y};
            let d = ((v.hist[v.hist.length-1]-v.hist[0])/v.hist[0] + 1.0)*100;
            v['densite'] = d;
        }
    }
}
function drawMunicipalite(x1,x2,y1,y2,ref) {
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
            circle(v.display.x,v.display.y,c);
        }
    }
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
    villesSel = points.length;
    listId = max(0,min(listId,villesSel-1));
	for (let i=0;i<points.length;i++) {
        let p = points[i];
		// point(p.x, p.y);
        // fill(10, 200, 150);
        fill(color(cVert));
        noStroke();
        strokeWeight(1);
        let k=1;
        if (p.info.data.sel == 1) { fill(p.info.data.couleur); stroke(p.info.data.couleur); }
        if( btDensite.value) fill(btDensite.couleur(p.info.data.densite));
        if (i==listId) {fill(255); k=2 ;}
        let c = getCircle(p.info.hist[Annee.Id]);
        circle(p.x,p.y,c*k);
        circle(75+(p.x-range.x)*zR,75+(p.y-range.y)*zR, 2*c*k);
        res += p.info.hist[Annee.Id];
        if (i<NB_VILLES_LISTE) {
            let x=10, y=i*12+180;
            noStroke();
            fill(color(cVert));
            if (p.info.data.sel == 1) { fill(p.info.data.couleur) }
            if (i==listId) {
                fill(255);
                Details.setValues(p.info.hist);
                beginShape();
                vertex(x-2,y+3);
                vertex(x-2,y-3);
                vertex(x+3,y);
                endShape(CLOSE);
                }
            textSize(10); 
            text(p.info.city,x+10,y);
            // text(p.info.city+' ('+p.info.data.densite+')',x+10,y);
            textSize(12);
            if (i==listId) {
                text(p.info.city+' - '+p.info.hist[Annee.Id],x, height-45);
            }
            if( btDensite.value) {
                let v = p.info.data.densite;
                fill(btDensite.couleur(v));
                if (v>100) {
                    beginShape(); vertex(x+4,y+3);vertex(x+10,y+3);vertex(x+7,y-3); endShape(CLOSE);
                } else {
                    beginShape(); vertex(x+4,y-3);vertex(x+10,y-3);vertex(x+7,y+3); endShape(CLOSE);
                }
            }
        }
	}
    return (res);    
}
function draw() {
    background(0);
    // [min_, max_] = getFrance();
    // drawVilles(min_, max_);
    // let [[minX,minY],[maxX,maxY]] = getMinMax();
    let r = width/height;
    let sum = 0;
    villes.forEach(a=>{ sum += a.hist[Annee.Id];});
    rate.html('execution en '+round(deltaTime)+' ms'+'    Année = '+Annee.annee+' -  pop= '+sum);
    if (DEBUG) noLoop();
    drawMunicipalite(MIN_X,MIN_X + (MAX_Y-MIN_Y)*r,MIN_Y,MAX_Y,Annee.Id);

    if (VERBOSE) qt.show();
    if (LOOP) nextYear();

    //get regions/dept
    let gR = new Rectangle(mouseX,mouseY,3,3);
    let pt = qt.query(gR);
    if (pt.length >0) {
        let dpt = pt[0].info.data.codeDept;
        Departements.setFocus(dpt);
    }

    selectRange = Annee.getSlider(mouseX,mouseY) | Departements.getSel(mouseX,mouseY) | btDensite.getOK(mouseX,mouseY);

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
    textAlign(CENTER,CENTER);
    textSize(10); fill(color(cVert));noStroke();
    text('eCoucou '+eC.version, width-40, height-10);
    textSize(32);
    text('FRANCE', width/2, 22);
}