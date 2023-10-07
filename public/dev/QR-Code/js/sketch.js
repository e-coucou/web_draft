const eC = {version: 'v0.1', release:'r0', date:'sep/23', owner: 'rky', code:'y2H', annee:'2023'};
let message = 'HELLO';
const QR_Type = ['L','M','Q','H'];
const QR_Version = [1,2,3,4,,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
let codePoly = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [0,251,67,46,61,118,70,64,94,32,45],
    [],
    [],
    [0,74,152,176,100,86,100,106,104,130,218,206,140,78],
    [],
    [],
    [],
    [],
    [0,215,234,158,94,184,97,118,170,79,187,152,148,252,179,5,98,96,153]
]
let padding = [0,0,7,7,7,7,7,0,0,0,0,0,0,0,3,3,3,3,3,3,3,4,4,4,4,4,4,4,3,3,3,3,3,3,3,0,0,0,0,0,0];
let poly;
let alphabet,qr_json,loc_json,info_json;
let qrcode=[], qrinfo=[];
let version = 1, type='Q', level = 0;
let grille=[], dim, largeur, w;
let code, base=104+104;
let qrType, qrInfo;

function preload() {
    alphabet = loadJSON('./data/alpha.json')
    qr_json = loadJSON('./data/block.json')
    loc_json = loadJSON('./data/patterns.json')
    info_json = loadJSON('./data/information.json')
}

function windowResized() {
    let h_ = innerHeight*0.98;
    let w_ = min(0.59*h_, innerWidth);
    dim = ((version-1)*4) + 21, largeur = int(w_/dim);
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
 
    windowResized();
    logTable();

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
    // console.log(code);
    code.convertDec();
    // 
    // code.messPoly = [67,85,70,134,87,38,85,194,119,50,6,18,6,103,38, // test 5-Q
    //     246,246,66,7,118,134,242,7,38,86,22,198,199,146,6,
    //     182,230,247,119,50,7,118,134,87,38,82,6,134,151,50,7,
    //     70,247,118,86,194,6,151,50,16,236,17,236,17,236,17,236]; // 5-Q
    // code.errorCode(code18); // 5-Q
    // code.messPoly = [32, 91, 11, 120, 209, 114, 220, 77, 67, 64, 236, 17, 236, 17, 236, 17]; // test 1-H
    // code.errorCode(code10); // 1-M
    code.errorCode();
}

function draw() {
    background(51);
    // la grille
    grille = [];
    for (let i=0; i<dim ; i++ ) {
        let ligne=[];
        for (let j=0; j<dim ; j++) {
            ligne.push(-1);
        }
        grille.push(ligne);
    }
    // finder patterns
    addPatterns(0,0);
    addPatterns(0,dim-7);
    addPatterns(dim-7,0);
    // separator
    addSeparators(0,7,7,0);
    addSeparators(0,dim-8,7,dim-8);
    addSeparators(dim-8,7,dim-8,0);
    // alignment pattern
    addLocator();
    // timing pattern
    addTiming();
    // dark module / reserved
    addReserved();
    // data bit
    addData(0); // mask=0 - prevoir une boucle avec evalution
    let info = [1,1]; // mode Q
    let maskP = [0,0,0];
    info.push(...maskP); // mask 0
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