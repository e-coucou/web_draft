const eC = {version: 'v1.0', release:'r0', date:'sep/23', owner: 'rky', code:'y2H', annee:'2023', maj:'oct/23'};

const quality = [{t:'L',i:[0,1],m:' (7%)'},{t:'M',i:[0,0],m:' (15%)'},{t:'Q',i:[1,1],m:' (25%)'},{t:'H',i:[1,0],m:(' (30%)')}];
const caracteres = [{l:1,h:9,A:{l:9},N:{l:10},B:{l:8}},{l:10,h:26,A:{l:11},N:{l:12},B:{l:16}},{l:27,h:40,A:{l:13},N:{l:14},B:{l:16}}];
let codePoly = [];
let padding = [0,0,7,7,7,7,7,0,0,0,0,0,0,0,3,3,3,3,3,3,3,4,4,4,4,4,4,4,3,3,3,3,3,3,3,0,0,0,0,0,0];
let couleurs = {Rouge:[120,50,0],Vert:[50,120,0], Bleu:[0,50,120]};
let poly;
let alphabet,qr_json,loc_json,info_json;
let qrcode=[], qrinfo=[];
let version = 2, type='Q', level = 0, mode = 'B';
let selLevel,selVersion,selType;
let grille=[], dim, largeur, w;
let code, base=104+104;
let qrType, qrInfo;
let message, message_l;
let btOptimise, logo, upload, texte, couleur;

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
    windowResized();
}

function windowResized() {
    let m = min(innerHeight,innerWidth);
    let padding = 20
    // let h_ = innerHeight*0.98;
    let w_ = m*0.6;
    largeur = round(w_/dim);
    w_ = dim*largeur;
    resizeCanvas(w_,w_);
    let x_ = (windowWidth - width) -padding;
    let y_ = 50; //(windowHeight - height) / 2;
    select('canvas').position(x_, y_);
    w = w_;
    selVersion.selected(version);
    selType.selected(type);
    selLevel.selected(level);
    btOptimise.position(x_ + w_/2 - btOptimise.width/2 - padding/2,  y_+w+10);
    selLevel.position(padding,50);
    selVersion.position(padding,100);
    selType.position(padding,150);
    couleur.position(padding,200);
    upload.position(padding,y_ + w+ 70+ btOptimise.height);
    texte.position(padding,y_+w+150);
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

function chgCouleur() {
    loop();
}

function setOptions() {
    btOptimise = select('#optimise');
    btOptimise.mousePressed(bestVersion);
    selLevel = createSelect();
    selLevel.class('styled_2');
    for (let i=0;i<8;i++) {
        selLevel.option("Pattern "+i,i);
    }
    selLevel.changed(chgLevel);
    selVersion = createSelect();
    selVersion.class('styled_2');
    for (let i=1;i<41;i++) {
        selVersion.option("Version "+i,i);
    }
    selVersion.changed(chgVersion);
    selType = createSelect();
    selType.class('styled_2');
    for (let v of quality) {
        selType.option("Qualité "+v.t+v.m, v.t);
    }
    selType.changed(chgType);
    upload = createFileInput(getFile);
    upload.class('styled_2');

    texte = createInput('eCoucou 2023');
    texte.input(newMessage);

    couleur = createSelect();
    couleur.class('styled_2');
    for (let c in couleurs) {
        couleur.option(c);
    }
    couleur.changed(chgCouleur);
}

function newMessage()  {
    message={bytes:[]};
    for (let c of this.value()) {
        let v = c.charCodeAt(0);
        message.bytes.push(v);
    }
    // console.log(message);
    encodeMess();
    bestVersion();
}

function getFile(file) {
    // console.log(file.data);
    message={bytes:[]};
    for (let c of file.data) {
        let v = c.charCodeAt(0);
        message.bytes.push(v);
    }
    // console.log(message);
    encodeMess();
    bestVersion();
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
    logTable();
    createPoly();
    setOptions();
    setVersion();
    encodeMess();
    bestVersion();

    frameRate(5);
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
    background(255);
    createQR();
    // dessine le QR-Code
    for (let i=0; i<dim ; i++ ) {
        for (let j=0; j<dim ; j++) {
            let x = i * largeur, y = j*largeur;
            let e=0;
            let a=random(0,10), b=random(0,10), c=  random(0,10), d=random(0,10);
            let g=random(1,5);
            switch (grille[i][j]) {
                case -1: fill(77);stroke(90);strokeWeight(2); e=1 ; break;
                case 0: fill(couleurs[couleur.value()][0]+g*((a>d)?a:-a),couleurs[couleur.value()][1]+g*((b>d)?b:-b),couleurs[couleur.value()][2]+g*((c>d)?c:-c));noStroke() ; break;
                case 1: fill(255);noStroke() ; break;
                case 2: fill(0,0,255);noStroke() ; break;
                case 3: fill(255,255,255);noStroke() ; break;
                case 4: fill(0,120,0);noStroke() ; break;
            }
            if (version>3) {
                let l =  round(width*0.2 / largeur /2 ) ;
                let st = dim/2 - l -1;
                let end = dim/2 + l;
                if (i>st && i<end && j>st && j<end) fill(255);
            }
            rect(x+e,y+e,largeur-2*e,largeur-2*e,a,b,c,d);
        }
    }
    if (version > 3 ){
        imageMode(CENTER);
        image(logo,width/2,height/2,0.2*width,0.2*width);
    }
    noLoop()
}