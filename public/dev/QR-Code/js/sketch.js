const eC = {version: 'v1.2', release:'r0', date:'sep/23', owner: 'rky', code:'y2H', annee:'2023', maj:'jan/24'};

const quality = [{t:'L',i:[0,1],m:' (7%)'},{t:'M',i:[0,0],m:' (15%)'},{t:'Q',i:[1,1],m:' (25%)'},{t:'H',i:[1,0],m:(' (30%)')}];
const caracteres = [{l:1,h:9,A:{l:9},N:{l:10},B:{l:8}},{l:10,h:26,A:{l:11},N:{l:12},B:{l:16}},{l:27,h:40,A:{l:13},N:{l:14},B:{l:16}}];
const couleurs = {Standard:[0,0,0], Noir:[0,0,0],Custom:[0,0,0],Rouge:[180,50,0],Vert:[50,120,0], Bleu:[0,50,120]};
const templates = [{t:'blank',v:0,m:'A'},{t:'VCARD', v:1, m:'B'},{t:'WIFI', v:2,m:'B'},{t:'SMS', v:3,m:'B'},{t:'eMAIL', v:4, m:'B'}];
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
let btOptimise, btSave, logo, upload, texte, couleur, mobile, couleurActive, getImage;
let tpt=[], template;

function preload() {
    alphabet = loadJSON('./data/alpha.json');
    qr_json = loadJSON('./data/block.json');
    loc_json = loadJSON('./data/patterns.json');
    info_json = loadJSON('./data/information.json');
    message = loadBytes('./data/vcard.txt');
    logo = loadImage('../../img/ecoucou.png');
    tpt.push({bytes:[32]});
    tpt.push(loadBytes('./data/template/vcard.tpt'));
    tpt.push(loadBytes('./data/template/wifi.tpt'));
    tpt.push(loadBytes('./data/template/sms.tpt'));
    tpt.push(loadBytes('./data/template/email.tpt'));
}
function saveQR() {
    saveGif('QR-Code',0.1);
}
function setVersion() {
    dim = ((version-1)*4) + 21;
    windowResized();
}
function setMessage(arr) {
    let m='';
    for (let b of arr) {
        m += String.fromCharCode(b);
    }
    return m;
}
function windowResized() {
    let padding = 20
    let m = min(innerHeight,innerWidth) - padding;
    let w_ = m*0.5;
    if (mobile) {
        w_ = m*0.95;
    }
    largeur = round(w_/dim);
    w_ = dim*largeur;
    resizeCanvas(w_,w_);
    let x_ = (windowWidth - w_ )/2 - padding;
    let y_ = 40; //(windowHeight - height) / 2;
    select('.right').position(x_, y_);
    w = w_;
    let h_ =  y_ + w_ + 40 + padding;
    let e = (w_ +30 - selLevel.elt.offsetWidth - selType.elt.offsetWidth - selVersion.elt.offsetWidth)/2;
    selVersion.selected(version);
    selType.selected(type);
    selLevel.selected(level);
    btOptimise.position(x_+padding, h_);
    btSave.position(x_+w_-btSave.width, h_); h_ += btOptimise.height + padding;
    selVersion.position(x_,h_ ); let p = e + selVersion.elt.offsetWidth;
    selType.position(x_+p,h_ ); p += e + selType.elt.offsetWidth;
    selLevel.position(x_+p,h_); h_ += selLevel.height + padding;
    upload.position(x_,h_);h_ += upload.height + padding;
    upload.style('width',w_+'px');
    selTemplate.position(x_,h_);h_ += selTemplate.height + padding;
    texte.position(x_,h_);h_ += texte.height + padding;
    texte.style('width',w_+padding+'px');
    getImage.position(x_,h_);h_ += getImage.height + padding;
    getImage.style('width',w_+'px');
    couleur.position(windowWidth-couleur.elt.offsetWidth-padding,1);
    couleurCusto.position(windowWidth-couleur.elt.offsetWidth-2*padding-couleurCusto.elt.offsetWidth,1);
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
    createQR(level);
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
    couleurActive = couleurCusto.value();
    switch (couleur.value()) {
        case 'Standard':
        case 'Custom':
        case 'Noir':
            select('body').style('background-color',color(200,200,200));
            selectAll('.styled_2').forEach(a=> {a.style('background-color',color(120,120,120))});
            selectAll('.styled').forEach(a=> {a.style('background-color',color(120,120,120))});
            selectAll('.styled:hover').forEach(a=> {a.style('background-color',color(2,96,60))});
            break;
        case 'Vert':
            select('body').style('background-color',color(198, 227, 199));
            selectAll('.styled_2').forEach(a=> {a.style('background-color',color(20,60,20))});
            selectAll('.styled').forEach(a=> {a.style('background-color',color(20,60,20))});
            selectAll('.styled:hover').forEach(a=> {a.style('background-color',color(2,96,60))});
            break;
        case 'Bleu':
            select('body').style('background-color',color(198, 199, 227));
            selectAll('.styled_2').forEach(a=> {a.style('background-color',color(20,20,60))});
            selectAll('.styled').forEach(a=> {a.style('background-color',color(20,20,60))});
            selectAll('.styled:hover').forEach(a=> {a.style('background-color',color(2,96,60))});
            break;
        case 'Rouge':
            select('body').style('background-color',color(237, 180, 180));
            selectAll('.styled_2').forEach(a=> {a.style('background-color',color(100,10,10))});
            selectAll('.styled').forEach(a=> {a.style('background-color',color(100,10,10))});
            selectAll('.styled:hover').forEach(a=> {a.style('background-color',color(2,96,60))});
            break;
        }
    loop();
}
function newTemplate() {
    template = tpt[selTemplate.value()];
    texte.elt.value = setMessage(template.bytes);
    texte.style('height','250px');
    message = template;
    message_l = template.bytes.length;
    bestVersion();
}
function newCouleur(){
    // console.log(couleurCusto.elt.value);
    couleur.value('Custom');
    couleurActive = couleurCusto.value();
    loop();
}
function newMessage()  {
    message={bytes:[],txt:''};
    let m_A = true;
    mode='B';
    for (let c of this.value()) {
        let v = c.charCodeAt(0);
        message.bytes.push(v);
        message.txt+=c;
        if (alphabet[c] == undefined) m_A=false;
    }
    message_l = message.bytes.length;
    if (m_A) mode='A';
    if (Number(message.txt)){
        console.log('Numéric MODE available', message.txt);
        mode='N';
    }
    bestVersion();
}

function uploadImage(file) {
    console.log(file)
    logo=loadImage(file.data,loop);
}

function getFile(file) {
    message={bytes:[],txt:''};
    for (let c of file.data) {
        let v = c.charCodeAt(0);
        message.bytes.push(v);
        message.txt+=c;
    }
    message_l = message.bytes.length;
    bestVersion();
}
function setOptions() {
    btOptimise = select('#optimise');
    btOptimise.mousePressed(bestVersion);
    btSave = select('#save');
    btSave.mousePressed(saveQR);
    selLevel = createSelect();
    selLevel.parent('selection');
    selLevel.class('styled_2');
    for (let i=0;i<8;i++) {
        selLevel.option("#"+i,i);
    }
    selLevel.changed(chgLevel);
    selVersion = createSelect();
    selVersion.class('styled_2');
    selVersion.parent('selection');
    for (let i=1;i<41;i++) {
        selVersion.option("Version "+i,i);
    }
    selVersion.changed(chgVersion);
    selType = createSelect();
    selType.parent('selection');
    selType.class('styled_2');
    for (let v of quality) {
        selType.option("Qualité "+v.t+v.m, v.t);
    }
    selType.changed(chgType);
    upload = createFileInput(getFile);
    upload.parent('selection');
    upload.class('styled_2');

    getImage = createFileInput(uploadImage);
    getImage.parent('selection');
    getImage.class('styled_2');

    texte = createElement('textarea','jan/24 : Custom Image/Color 😉 !');
    texte.input(newMessage);
    texte.parent('selection');

    couleurCusto = createElement('textarea','#ff2266');
    couleurCusto.input(newCouleur);
    couleurCusto.parent('selection');
    couleurCusto.class('styled_Couleur');
    couleurActive = couleurCusto.value();

    couleur = createSelect();
    couleur.parent('selection');
    couleur.class('styled_2');
    for (let c in couleurs) {
        couleur.option(c);
    }
    couleur.changed(chgCouleur);
    couleur.value('Vert');

    selTemplate = createSelect();
    selTemplate.parent('selection');
    selTemplate.changed(newTemplate);
    selTemplate.class('styled_2');
    for (let c of templates) {
        selTemplate.option(c.t,c.v);
    }
}
function setup() {
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    canvas = createCanvas(10,10); // mise en place du ratio 0.59
    canvas.parent("#canvas");

    loadData();
    logTable();
    createPoly();
    setOptions();
    setVersion();
    message_l = message.bytes.length;
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
    // console.log(qrType, qrInfo);

    code = new Encodeur(message);
    code.setEC(qrType);
    code.encode();
    if (message_l >= qrType.d) console.log('ca va pas tenir ...');
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
function createQR(level_) {
    // init de la grille
    clearGrid();
    let info = quality.find(a=>{return (a.t == type)}).i.slice(); // mode Q
    // console.log('xxxxxxxx',quality.find(a=>{return (a.t == type)}))
    mask_ = new Binary(level_,3); mask_.encode();
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
    createQR(level);
    let taille = 0.2;
    let ratio = logo.width/logo.height;
    switch(type){
        case 'H' : taille=0.32; break;
        case 'Q' : taille=0.28; break;
        case 'M' : taille=0.23; break;
        case 'L' : taille=0.20; break;
    }
    // dessine le QR-Code
    for (let i=0; i<dim ; i++ ) {
        for (let j=0; j<dim ; j++) {
            let x = i * largeur, y = j*largeur;
            let e=0;
            let a=random(0,10), b=random(0,10), c=  random(0,10), d=random(0,10);
            let g=random(1,5);
            switch (grille[i][j]) {
                case -1: fill(77);stroke(90);strokeWeight(2); e=1 ; break;
                case 0: 
                    if (couleur.value()=='Standard') {
                        fill(0);
                    } else {
                        if (couleur.value()=='Custom') {
                            fill(color(couleurActive))
                        } else {
                            fill(couleurs[couleur.value()][0]+g*((a>d)?a:-a),couleurs[couleur.value()][1]+g*((b>d)?b:-b),couleurs[couleur.value()][2]+g*((c>d)?c:-c));noStroke() ;
                        }
                    } break;
                case 1: fill(255);noStroke() ; break;
                case 2: fill(0,0,255);noStroke() ; break;
                case 3: fill(255,255,255);noStroke() ; break;
                case 4: fill(0,120,0);noStroke() ; break;
            }
            if (couleur.value() == 'Standard') {
                rect(x+e,y+e,largeur-2*e,largeur-2*e);
            } else {
                if (version>3) {
                    let l =  round(width*taille / largeur /2 ) ;
                    let stX = dim/2 - l -1;
                    let endX = dim/2 + l;
                    let stY = dim/2 - round(l/ratio) -1;
                    let endY = dim/2 + round(l/ratio);
                    if (i>stX && i<endX && j>stY && j<endY) fill(255);
                }
                rect(x+e,y+e,largeur-2*e,largeur-2*e,a,b,c,d);
            }
        }
    }
    if (version > 3 && couleur.value()!= 'Standard' ){
        imageMode(CENTER);
        image(logo,width/2,height/2,taille*width,taille*width/ratio);
    }
    noLoop()
}