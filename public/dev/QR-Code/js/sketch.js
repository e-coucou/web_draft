const eC = {version: 'v0.1', release:'r0', date:'sep/23', owner: 'rky', code:'y2H', annee:'2023'};
let message = 'HELLO WORLD';
// let message = 'CECI EST UN ESSAI DE CODAGE ...';
const quality = [{t:'L',i:[0,1]},{t:'M',i:[0,0]},{t:'Q',i:[1,1]},{t:'H',i:[1,0]}];
const QR_Version = [1,2,3,4,,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
const char = [{n:9,A:{l:9}},{n:26,A:{l:11}}];
let codePoly = [];
let padding = [0,0,7,7,7,7,7,0,0,0,0,0,0,0,3,3,3,3,3,3,3,4,4,4,4,4,4,4,3,3,3,3,3,3,3,0,0,0,0,0,0];
let poly;
let alphabet,qr_json,loc_json,info_json;
let qrcode=[], qrinfo=[];
let version = 2, type='Q', level = 0;
let selLevel,selVersion,selType;
let grille=[], dim, largeur, w;
let code, base=104+104;
let qrType, qrInfo;

function preload() {
    alphabet = loadJSON('./data/alpha.json')
    qr_json = loadJSON('./data/block.json')
    loc_json = loadJSON('./data/patterns.json')
    info_json = loadJSON('./data/information.json')
}

function setVersion() {
    dim = ((version-1)*4) + 21;
    windowResized();
}

function windowResized() {
    let h_ = innerHeight*0.98;
    let w_ = min(0.59*h_, innerWidth);
    largeur = int(w_/dim);
    w_ = dim*largeur;
    resizeCanvas(w_,w_);
    let x_ = (windowWidth - width) / 2;
    let y_ = (windowHeight - height) / 2;
    select('canvas').position(x_, y_+10);
    w = w_;
}
function loadData() {
    for (let i=0; i<Object.keys(qr_json).length;i++) {
        let m = qr_json[i];
        qrcode.push(m);
    }
    for (let i=0; i<Object.keys(info_json).length;i++) {
        let m = info_json[i];
        qrinfo.push(m);
    }
}
function chgLevel(){
    level = int(selLevel.value());
    // encodeMess();
    loop();
}
function chgVersion(){
    version = int(selVersion.value());
    setVersion();
    encodeMess();
    loop();
}
function chgType() {
    type = selType.value();
    encodeMess();
    loop();
}

function setOptions() {
    selLevel = createSelect();
    for (let i=0;i<8;i++) {
        selLevel.option("Pattern "+i,i);
    }
    selLevel.changed(chgLevel);
    selVersion = createSelect();
    for (let i=1;i<41;i++) {
        selVersion.option("Version "+i,i);
    }
    selVersion.changed(chgVersion);
    selType = createSelect();
    for (let v of quality) {
        selType.option("Qualité "+v.t, v.t);
    }
    selType.changed(chgType);
}

function setup() {
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    let h_ = innerHeight*0.98;
    let w_ = min(0.59*h_, innerWidth);
    dim = ((version-1)*4) + 21, largeur = int(w_/dim);
    w_ = dim*largeur;
    canvas = createCanvas(w_,w_); // mise en place du ratio 0.59
    canvas.parent("#canvas");
    let x = (windowWidth - width) / 2;
    let y = (windowHeight - height) / 2;
    canvas.position(x, y+10);
    loadData();
    setVersion();
    logTable();
    createPoly();
    setOptions();

    encodeMess();
}

function keyPressed() {
    if (key == ' ') base+=1;
    loop();
}

function encodeMess() {
    let qTypeVersion = ''+version+'-'+type; console.log(qTypeVersion);
    qrType = qrcode.filter(a => { return ( a.v == qTypeVersion)})[0];
    qrInfo = qrinfo.filter(a => { return ( a.type == type && a.level == level)})[0];
    console.log(qrType, qrInfo);

    code = new Encodeur(message);
    code.setEC(qrType);
    code.split(); // code.print();
    code.encode();
    code.convertDec();
    code.errorCode();
}
function clearGrid() {
    grille = [];
    for (let i=0; i<dim ; i++ ) {
        let ligne=[];
        for (let j=0; j<dim ; j++) {
            ligne.push(-1);
        }
        grille.push(ligne);
    }
}

function draw() {
    background(51);
    // init de la grille
    clearGrid();
    let info = quality.find(a=>{return (a.t == type)}).i.slice(); // mode Q
    // console.log('xxxxxxxx',quality.find(a=>{return (a.t == type)}))
    mask_ = new Binary(level,3); mask_.encode();
    console.log(level, mask_.code);
    let maskP = mask_.code;
    info.push(...maskP); // mask 0
    // finder patterns
    addPatterns(0,0);
    addPatterns(0,dim-7);
    addPatterns(dim-7,0);
    // // separator
    addSeparators(0,7,7,0);
    addSeparators(0,dim-8,7,dim-8);
    addSeparators(dim-8,7,dim-8,0);
    // // alignment pattern
    addLocator();
    // // timing pattern
    addTiming();
    // // dark module / reserved
    addReserved();
    // // data bit
    addData(level); // mask=0 - prevoir une boucle avec evalution
    addString(info);
    // information
    // dessine le QR-Code
    for (let i=0; i<dim ; i++ ) {
        for (let j=0; j<dim ; j++) {
            let x = i * largeur, y = j*largeur;
            let e=0;
            switch (grille[i][j]) {
                case -1: fill(77);stroke(90);strokeWeight(2); e=1 ; break;
                case 0: fill(0);noStroke() ; break;
                case 1: fill(255);noStroke() ; break;
                case 2: fill(0,0,255);noStroke() ; break;
                case 3: fill(0,255,220);noStroke() ; break;
                case 4: fill(255,220,0);noStroke() ; break;
            }
            rect(x+e,y+e,largeur-2*e,largeur-2*e);
        }
    }
    noLoop()
}