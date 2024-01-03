const eC = {version: 'v1.0', release:'r0', date:'dec/23', owner: 'rky', code:'y2H', annee:'2023', maj:'dec/23'};
let mobile;
let DEBUG = false, VERBOSE = false, LOOP = false, DENSITE = false;

const cVert = [10,200,150];
const offset = 50;
let bgRate;

let startTime, endTime;

let joueurs = [], nbTirages=0;
const FAIR=0.5, TRICHE=0.75, SAMPLES=64*64;
const FAUX_NEGATIF = 0.2, FAUX_POSITIF = 0.95;
let probaF=[], probaT=[], corr = [[0,0],[0,0]];

let anim=false, anim_cpt=0;

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
    let wm = innerWidth * 0.92;
    let hm = innerHeight * 0.92;
    resizeCanvas(wm-10,hm-10);
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

    for (let i=0;i<(SAMPLES/2);i++) {
        joueurs.push(new Joueur('Fair',FAIR))
    }
    for (let i=0;i<(SAMPLES/2);i++) {
        joueurs.push(new Joueur('Tricheur',TRICHE))
    }
}

function prob() {
    return 0;
}

function addTirage() {
    probaF=[], probaT=[];
    for (let i=0; i<=nbTirages; i++) {

        let k = fact(nbTirages)/fact(i)/fact(nbTirages-i);
        let p= k*Math.pow(FAIR,i) * Math.pow(1-FAIR,nbTirages-i);
        probaF.push(p);
        p = k*Math.pow(TRICHE,i) * Math.pow(1-TRICHE,nbTirages-i);
        probaT.push(p);
    }
    let cpt=0, seuil=-1;
    for (let i=0;i<probaF.length;i++) {
        if (cpt>0.95) {seuil=i; break;}
        cpt += probaF[i];
    }
    // console.log(seuil);
    // on effectue le tirage ...
    for (let j of joueurs) {
        j.add(seuil);
    }
    nbTirages++;
    corr[0][0] = joueurs.reduce((a,v) => { return ((!v.info & v.type==('Fair'))?(a+1):a);},0);
    corr[0][1] = joueurs.reduce((a,v) => { return ((v.info & v.type==('Fair'))?(a+1):a);},0);
    corr[1][0] = joueurs.reduce((a,v) => { return ((!v.info & v.type==('Tricheur'))?(a+1):a);},0);
    corr[1][1] = joueurs.reduce((a,v) => { return ((v.info & v.type==('Tricheur'))?(a+1):a);},0);

    anim=true;
    anim_cpt=0;
}
function fact(n) {
    if (n==0) return 1;
    if (n==1) {return n; } else {
        return n*fact(n-1);
    }
}
function draw() {
    background(0);
    rate.html(' Exécution en '+round(deltaTime)+' ms');
    fill(0); stroke(255);
    rect(offset,offset,width-offset,height-2*offset);

    // for (let i =0; i<joueurs.length;i++) {
    //     let j = joueurs[i];
    //     let x = (i % 20) * 20 + offset + 10;
    //     let y = int(i / 20) * 20 + offset + 10;
    //     fill(255,0,255); noStroke()
    //     if (t) fill(0,255,255);
    //     circle(x,y,18)
    // }
    textAlign(CENTER,CENTER);
    textSize(10); fill(color(cVert));noStroke();
    text('eCoucou '+eC.version, width-40, height-10);

    maxY1 = Math.max(...probaF); 
    maxY2 = Math.max(...probaT);
    let maxY = Math.max(maxY1,maxY2);
    let g = new Graphe(probaF, offset+10,offset+10,width-(offset+20),height/5);
    g.setMaxY(maxY);
    g.setSeuilSup(FAUX_POSITIF);g.setTitre('Joueurs Normaux')
    g.show();
    g = new Graphe(probaT, offset+10,offset+10+170,width-(offset+20),height/5);
    g.setMaxY(maxY);
    g.setSeuilInf(FAUX_NEGATIF); g.setTitre('Tricheurs ...')
    g.show();

    cor = new Correlation(corr,offset+width/6,height/2+offset,width/4);
    cor.setMax(SAMPLES/2*0.05);
    cor.setMin(SAMPLES/2*0.8);
    cor.show();

    let n = Math.sqrt(SAMPLES);
    let w = int(min((width-offset)/2,(height-offset)/2) / n);
    for (let i=0; i<SAMPLES ; i++) {
        let x = int(i % n) * w + (width+2*offset)/2;
        let y = int(i / n) * w + height/2;
        if (anim) {
            joueurs[i].anim(x,y,w,anim_cpt);
        } else {
            joueurs[i].show(x,y,w);
        }
    }
    if (anim) {
        anim_cpt++;
        if (anim_cpt > 9) {
                anim = false;
                anim_cpt=0;
        }
    }

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



class Joueur {
    constructor(t,p) {
        this.type=t;
        this.prob=p;
        this.tirages = [];
        this.info = false;
    }

    add(s) { // s = seuil de triche !
        let v = random()<this.prob;
        this.tirages.push(v);
        let n = this.tirages.reduce((a,v)=>{ return (v?(a+1):a);},0);
        if (n>=s) {this.info=true;} else {this.info=false;}
    }

    show(x,y,w) {
        fill(255,255,0); noStroke();
        if (this.type == 'Fair') fill(0,255,255);        
        rect(x,y,w,w);
        let t = this.tirages.slice(-1)[0];
        fill(255); stroke(255); strokeWeight(1);
        if (t) { fill(120); stroke(120); }
        if (this.info) {stroke(255,0,0);}
        circle(x+w/2,y+w/2,(w-1.5));
    }

    anim(x,y,w,n) {
        fill(255,255,0); noStroke();
        if (this.type == 'Fair') fill(0,255,255);
        rect(x,y,w,w);
        let v =  int(n+int(random(36))) % 36;
        let wx = w * Math.cos(v/36*PI/2);
        let t = (v>1) ^ this.tirages.slice(-1)[0];
        fill(255); stroke(255); strokeWeight(1);
        if (t) { fill(120); stroke(120); }
        ellipse(x+w/2,y+w/2,(wx-2),(w-2));
    }
}