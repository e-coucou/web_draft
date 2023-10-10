const eC = {version: 'v0.1', release:'r0', date:'sep/23', owner: 'rky', code:'y2H', annee:'2023'};
// let message = 'éric';
// let message = "Hello, World! Ceci est un essai d'encodage d'un message en QR-Code. by eCoucou éric !";
// const message = "a"; //+fromCharCode(0x0D)+fromCharCode(0x0A)+"VERSION:3.0"+fromCharCode(0x0D)+fromCharCode(0x0A)+"FN:Eric PLAIDY"+fromCharCode(0x0D)+fromCharCode(0x0A)+"END:VCARD";
// FN:Forrest Gump ORG:Bubba Gump Shrimp Co. TITLE:Shrimp Man TEL;TYPE=work,voice;VALUE=uri:tel:+1-111-555-1212 TEL;TYPE=home,voice;VALUE=uri:tel:+1-404-555-1212 ADR;TYPE=WORK;PREF=1;LABEL='100 Waters Edge\nBaytown\n, LA 30314\nUnited States of America':;;100 Waters Edge;Baytown;LA;30314;United States of America ADR;TYPE=HOME;LABEL='42 Plantation St.\nBaytown\, LA 30314\nUnited States of America':;;42 Plantation St.;Baytown;LA;30314;United States of America EMAIL:forrestgump@example.com REV:20080424T195243Z x-qq:21588891 END:VCARD"

const quality = [{t:'L',i:[0,1]},{t:'M',i:[0,0]},{t:'Q',i:[1,1]},{t:'H',i:[1,0]}];
const caracteres = [{l:1,h:9,A:{l:9},N:{l:10},B:{l:8}},{l:10,h:26,A:{l:11},N:{l:12},B:{l:16}},{l:27,h:40,A:{l:13},N:{l:14},B:{l:16}}];
let codePoly = [];
let padding = [0,0,7,7,7,7,7,0,0,0,0,0,0,0,3,3,3,3,3,3,3,4,4,4,4,4,4,4,3,3,3,3,3,3,3,0,0,0,0,0,0];
let poly;
let alphabet,qr_json,loc_json,info_json;
let qrcode=[], qrinfo=[];
let version = 2, type='Q', level = 0, mode = 'B';
let selLevel,selVersion,selType;
let grille=[], dim, largeur, w;
let code, base=104+104;
let qrType, qrInfo;
let message, message_l;
let btOptimise;
let logo;

function preload() {
    alphabet = loadJSON('./data/alpha.json');
    qr_json = loadJSON('./data/block.json');
    loc_json = loadJSON('./data/patterns.json');
    info_json = loadJSON('./data/information.json');
    message = loadBytes('./data/vcard.txt');
    logo = loadImage('../../img/ecoucou.png');
}

function setVersion() {
    dim = ((version-1)*4) + 21;
    // selVersion.value = version;
    windowResized();
}

function windowResized() {
    let m = min(innerHeight,innerWidth);
    let h_ = innerHeight*0.98;
    let w_ = m*0.8;
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
    createQR();
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
    btOptimise = select('#optimise');
    btOptimise.mousePressed(bestVersion);
    selLevel = createSelect();
    selLevel.class('styled_2')
    for (let i=0;i<8;i++) {
        selLevel.option("Pattern "+i,i);
    }
    selLevel.changed(chgLevel);
    selVersion = createSelect();
    selVersion.class('styled_2')
    for (let i=1;i<41;i++) {
        selVersion.option("Version "+i,i);
    }
    selVersion.changed(chgVersion);
    selType = createSelect();
    selType.class('styled_2')
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
    createQR();
}

function keyPressed() {
    if (key == ' ') base+=1;
    loop();
}

function encodeMess() {
    qrType = qrcode.filter(a => { return ( a.v == version && a.t==type)})[0];
    qrInfo = qrinfo.filter(a => { return ( a.type == type && a.level == level)})[0];
    console.log(qrType, qrInfo);

    code = new Encodeur(message);
    code.setEC(qrType);
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
function createQR(level_ = level) {
    // init de la grille
    clearGrid();
    let info = quality.find(a=>{return (a.t == type)}).i.slice(); // mode Q
    // console.log('xxxxxxxx',quality.find(a=>{return (a.t == type)}))
    mask_ = new Binary(level,3); mask_.encode();
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
    addData(level_); // mask=0 - prevoir une boucle avec evalution
    addString(info);
}

function draw() {
    background(51);
    createQR();
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
            rect(x+e,y+e,largeur-2*e,largeur-2*e,5);
        }
    }
    imageMode(CENTER);
    image(logo,width/2,height/2,0.2*width,0.2*width);
    noLoop()
}