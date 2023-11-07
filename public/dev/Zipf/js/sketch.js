const eC = {version: 'v0.01', release:'r0', date:'nov/23', owner: 'rky', code:'y2H', annee:'2023', maj:'oct/23'};
let mobile;
let DEBUG = true;

let villes = [];
let iter;
const a1 = Math.log(33000);
let france=[];
let municipalities = [];
let nb=0;

function preload() {
    france.push(loadTable('./data/2020.csv','ssv','header'));
    // france.push(loadTable('./data/2019.csv','ssv','header'));
}
function getFrance() {
    villes=[];
    let min_=Infinity, max_=0;
    for (let r of france[0].rows) {
        // console.log(r.obj)
        pop = int(r.obj.PMUN20.replace(/\s/g,''));
        libelle = r.obj.NCC;
        id = r.obj.COM;
        villes.push( pop);
        if (pop<min_) min_ = pop;
        if (pop>max_) max_ = pop;
        if (nb<1) {
            url = 'https://api-adresse.data.gouv.fr/search/?q='+libelle+'&citycode='+id+'&type=municipality';
            info = httpGet(url, (data)=> {
                municipalities.push(info);
            });
        }
        nb++;
    }
    villes.sort((a,b)=> {return (b-a);});
    return [min_, max_];
}

function windowResized() {
    let m = min(innerHeight,innerWidth);
    let w_ = int(m*0.8) - 10;
    resizeCanvas(innerWidth-10,innerHeight-200);
}

function mapLog(v0,x0,x1,y0,y1) {
    let v = (v0>=0)?Math.log(v0):0;
    return ((v-x0) * (y1-y0) / (x1 - x0) + y0 );
}

function Init(nb) {
    for ( let i=0; i<nb;i++) {
        villes.push(300);
    }
}

function Evolution() {
    let min_=Infinity, max_=0;
    for (let v in villes) {
        villes[v] = round(villes[v] * (1+ randomGaussian()/100) + 0.022);
        if (villes[v] > max_) max_ = villes[v];
        if (villes[v] < min_) min_ = villes[v];
    }
    villes.sort((a,b)=>{return (b-a);})
    return [min_, max_];
}

function drawVilles(min_, max_) {
    fill(255);
    noStroke();
    let cnt = villes.length;
    let inc = width/cnt;
    let x0 = (min_>0)?Math.log(min_):0;
    let x1 = log(max_);
    for (let i=0; i<cnt; i++) {
        // let y = map(villes[i],min_, max_,0,height);
        let y = mapLog(villes[i],x0, x1,height,0);
        let x = mapLog(i+1,0,a1,0,width);
        // let x = i * inc;
        circle(x,y,2);
    }
}
function keyPressed() {
    if (key=='s') {
        b_canon =  !b_canon;
    }
    if (key=='l') {
        loop();
    }
    if (key=='d') {
        DEBUG = ! DEBUG;
    }
}
function simul() {
    for (let i=0; i<365;i++) {
        [min_, max_] = Evolution();
        iter++;
    }
}

function setup() {
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    canvas = createCanvas(10,10); // mise en place du ratio 0.59
    canvas.parent("#canvas");
    windowResized();
    rate = select("#rate");
    Init(33000);
    iter=0;
}

function draw() {
    background(0);
    let min_, max_;
    [min_, max_] = getFrance();
    drawVilles(min_, max_);
    let sum = villes.reduce((a,v)=>{return a+v;});
    rate.html('execution en '+round(deltaTime)+' ms'+'    Nombre de particules = '+iter+' - distrib '+round(min_)+'/'+round(max_)+'  pop= '+sum);
    if (DEBUG) noLoop();
}