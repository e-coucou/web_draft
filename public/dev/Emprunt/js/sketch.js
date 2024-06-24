const eC = {version: 'v0.1', release:'r0', date:'june/24', owner: 'rky', code:'y2I', annee:'2024', maj:'june/24'};
let mobile;
let DEBUG = false, VERBOSE = false, LOOP = false, DENSITE = false;

let startTime, endTime;

let K=300_000,N=15,T=0.032, A=0.66/100, seuilM=2500, seuilm = 1500;
let padding=10;
let Bien = 400_000, FraisNotaire, Apport=0.;
const NOTAIRE = {"Mutation":0.0580 , "Emolument" : 0.0081 , "Fixe" : 405.0, "TVA":0.20,"Frais": 1000.0};

let h, w , maxR;

let yOff, xOff, xScale , yScale;

const MAX_K = 800_000;
const MAX_A = 25.;
const MAX_BIEN = 1_500_000;

function start() {
    startTime = new Date();
}
function end() {
    endTime = new Date();
    return (endTime-startTime);
}

// function preload() {
//     // voir getdata.js pour les preloads
//     // dataJson = loadJSON('./data/dataEP.json');
//     // img = loadImage('./img/joconde.jpg');
//     fCSV = loadTable('./data/programme.csv','csv');
// }


function windowResized() {
    let m = min(innerHeight,innerWidth) * 0.92;
    resizeCanvas(m,m);

    h=int(height/2);
    w= width/2 - 2*padding;
    maxR = 6000.0;

    yOff = int(height*3/4);
    xOff = 0+padding;
    xScale = w/N/12
    yScale = h/maxR;

    Update(xOff, yOff,yScale,w);
    UpdateBien(Bien);
}

function setup() {
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    // get les data =
    canvas = createCanvas(1,1); // mise en place du ratio 0.59
    canvas.parent("#canvas");
    rate = select("#rate");
    vx=select("#vx"); vx.html('⌖ '+eC.version+' '+eC.release+' >'+eC.maj+'<');
    cr=select("#cr"); cr.html('(ツ) © eCoucou '+eC.annee);

    getCapital = new BARMOUSE();
    getAnnee = new BARMOUSE(CURSEUR);
    getSeuilM = new VERTMOUSE();
    getSeuilm = new VERTMOUSE(CURSEUR_G);
    getBien = new BARMOUSE();
    getApport = new BARMOUSE();

    windowResized();
}

function mouse_(x,y) {
}
function touchStarted() {
    mouseSelection=true;
    let fs =fullscreen();
    // console.log(fs);
    // if (!fs) { fullscreen(true);}
    mouse_(touches[0].x, touches[0].y);
}

// function mousePressed() {
//     mouse_();
// }
function mouseClicked() {
    mouse_(mouseX,mouseY);
}

function computeTable(n = N*12, t=T/12) {
    let v_k=[], v_i=[], v_a=[], m;
    let a = A/12;

    m = K * t / (1- Math.pow((1+t), -n));
    let c=0, I=0;

    for (let i=0; i<n; i++) {
        let ii = (K-c)*t;
        let ci = m - ii;
        v_k[i] = ci;
        v_i[i] = ii;
        v_a[i] = (K-c)*a;
        c += ci;
        I += ii;
    }
    return [m,v_k, v_i, v_a];
}

function UpdateBien(b) {
    Bien = b;
    let F = (NOTAIRE.Emolument*b + NOTAIRE.Frais + NOTAIRE.Fixe)*(1+NOTAIRE.TVA);
    F += b*NOTAIRE.Mutation;
    if (Apport==0) Apport = 0.20*b;
    K = b - Apport + F;
    FraisNotaire = F;
}

function Update(xOff, yOff,yScale,w) {
    getBien.init(xOff,yOff+4*padding,w/4,2*padding);
    getApport.init(xOff,yOff+8*padding,w/4,2*padding);
    getCapital.init(xOff,yOff+padding,w/4,2*padding);
    getSeuilM.init(width-padding,-1000*yScale,padding,yOff);
    v = 1 - (seuilM-1000)/(yOff/yScale);
    getSeuilM.setRatio(v);
    getSeuilm.init(width/2,3000*yScale,padding,yOff-3000*yScale);
    v = (yOff/yScale-3000);
    getSeuilm.setRatio((v-seuilm)/v);
    getAnnee.init(xOff+width/2,yOff+padding,w,2*padding);
    getAnnee.setRatio(N/MAX_A);
}

function UpdateShowBien() {
    getBien.setRatio(Bien/MAX_BIEN);
    textAlign(LEFT,CENTER);
    textSize(14); fill(255);noStroke();
    y = yOff + 5*padding;
    getApport.setRatio(Apport/Bien);
    text( "Montant du Bien: "+int(Bien)+" €", w/3, y);
    text( "Apport personnel: "+int(Apport)+" €", w/3, y+4*padding);
    text( "Estimation Frais Notaire: "+int(FraisNotaire)+" €", w/3, y+8*padding);
}
function UpdateCapital() {
    getCapital.setRatio(K/MAX_K);
    textAlign(LEFT,CENTER);
    textSize(14); fill(255);noStroke();
    y = yOff + 2*padding;
    text( "Montant à Emprunter: "+int(K)+" €", w/3, y);
}

function UpdateApport(A) {
    Apport = A;
    K = Bien - Apport + FraisNotaire;
}

function draw() {
    background(0);
    rate.html(' Exécution en '+round(deltaTime)+' ms');

    let [m,V,I,A] = computeTable();
    let Interet = I.reduce((a,b) => {return (a+b);});

    yOff = int(height*3/4);
    xOff = 0+padding;
    xScale = w/N/12
    
    getBien.show();
    if (getBien.InBox(mouseX,mouseY)) {
        let r = round(getBien.Ratio(mouseX)*1000)/1000.;
        UpdateBien(MAX_BIEN*r);
    }
    getApport.show();
    if (getApport.InBox(mouseX,mouseY)) {
        let r = round(getApport.Ratio(mouseX)*1000)/1000.;
        UpdateApport(r * Bien);
        // UpdateBien(MAX_BIEN*r);
    }
    getCapital.show();
    if (getCapital.InBox(mouseX,mouseY)) {
        let r = round(getCapital.Ratio(mouseX)*1000)/1000.;
        K = MAX_K*r;
        Apport = Bien + FraisNotaire - K;
    }
    getSeuilM.show();
    if (getSeuilM.InBox(mouseX,mouseY)) {
        let r = (1 - getSeuilM.Ratio(mouseY));
        seuilM = (yOff)/yScale*r + 1000;
    }
    getSeuilm.show();
    if (getSeuilm.InBox(mouseX,mouseY)) {
        let r = (1 - getSeuilm.Ratio(mouseY));
        seuilm = (yOff-3000*yScale)/yScale*r;
    }

    UpdateCapital();
    UpdateShowBien();
// Trace du capital
    fill("#3700B3"); stroke(255);strokeWeight(1);
    beginShape();
        for (let i=0; i<(N*12);i++) {
            let x = i*xScale + xOff;
            let y = h - V[i]*yScale - maxR*yScale + yOff;
            vertex(x,y);
        }
        let y = h - m*yScale - maxR*yScale + yOff;
        vertex(w+xOff,y)
        vertex(w+xOff,h -  maxR*yScale + yOff);
        vertex(0+padding,h - maxR*yScale + yOff)
    endShape(CLOSE)
// trace des interet
    fill("#b00020"); stroke(255,0,0);
    beginShape();
        for (let i=0; i<(N*12);i++) {
            let x = i*xScale + xOff;
            let y = h - V[i]*yScale - maxR*yScale + yOff;
            vertex(x,y);
        }
        y = h - m*yScale - maxR*yScale + yOff;
        vertex(w,y);
        vertex(0+padding,y)
    endShape(CLOSE)
// trace de l'assurance
    fill(255,255,0); stroke(0,255,0);
    beginShape();
        for (let i=0; i<(N*12);i++) {
            let x = i*xScale + xOff;
            let y = h - A[i]*yScale - maxR*yScale + yOff - m*yScale;
            vertex(x,y);
        }
        y = h - m*yScale - maxR*yScale + yOff;
        vertex(w,y);
        vertex(0+padding,y)
    endShape(CLOSE)

    fill(255);noStroke();
    circle(w,y,3);
    circle(w,0+ yOff,3);
    circle(w,h+ yOff,3);
//Trace des simulation differents periode de remboursement
    let M = [];
    for (let a=1;a<=25;a++) {
        let [m,_a,_b,_c] = computeTable(a*12);
        M.push(m);
    }
    xScale = w/M.length;
    xOff = width/2+padding;
    noStroke();
    let w0 = 0.8*xScale;
    let h0 = h - maxR*yScale + yOff;
    for (let i=0; i<M.length;i++) {
        let x = i*xScale +xOff;
        let y = h - M[i]*yScale - maxR*yScale + yOff;
        // circle(x,y,5);
        fill("#3700B3");
        if ( i == N-1) fill("#63DAC5");
        rect(x,y,w0,h0-y);
    }
    getAnnee.show();
    if (getAnnee.InBox(mouseX,mouseY)) {
        let r = getAnnee.Ratio(mouseX);
        N =  int(M.length*r+1);
    }

    // Affichage des echelles
    stroke(0,255,255);fill(255);
    y = h - m*yScale - maxR*yScale + yOff;
    line(0+xOff,y,w+xOff,y);
    stroke(120);
    y = h - maxR*yScale + yOff;
    line(0,y,width,y);
    y = h - maxR*yScale + yOff;
    line(0,y,0,0);
    for (let i=0;i<=int(maxR/1000.);i++) {
        let x = 0;
        let y = h - (i*1000)*yScale - maxR*yScale + yOff;
        circle(x,y,5);
    }
    //les seuils
    noFill(); stroke("#b00020");strokeWeight(3);
    y = h - seuilM*yScale - maxR*yScale + yOff;
    line(0+xOff,y,w+xOff,y);
    fill(100,100); noStroke();
    rect(xOff,0,w,y-2);
    stroke("#018786");
    y = h - seuilm*yScale - maxR*yScale + yOff;
    line(0+xOff,y,w+xOff,y);
    fill(100,100); noStroke();
    rect(xOff,y+2,w,yOff-y-2);

    textAlign(LEFT,CENTER);
    textSize(14); fill(255);noStroke();
    y = h - m*yScale - maxR*yScale + yOff;
    text( int(Interet)+" €", 20+padding, y+20);
    y = h - maxR*yScale + yOff;
    text( int(K)+" €", w-70, y-20);
    fill("#63DAC5");
    y = h - m*yScale - maxR*yScale + yOff;
    text( nf(m,2,2)+" €", width-70, y-20);

    fill(255);
    y = h - seuilM*yScale - maxR*yScale + yOff;
    text( nf(seuilM,2,2)+" €", width/2+20, y-10);
    y = h - seuilm*yScale - maxR*yScale + yOff;
    text( nf(seuilm,2,2)+" €", width/2+20, y+10);

    textAlign(CENTER,CENTER);
    textSize(29); fill(255);noStroke();
    y = h - m*yScale - maxR*yScale + yOff;
    text( N+" ans", width*6/7, 200);

    textAlign(CENTER,CENTER);
    textSize(10); fill("#000000");noStroke();
    text('eCoucou '+eC.version, width-40, height-10);

// noLoop();
}


//------------------------------------------------------------
const BAR=0;
const CURSEUR=1;
const CURSEUR_D = 2;
const CURSEUR_G = 3;
class BARMOUSE {
    constructor(mode=BAR) {
        this.mode = mode;
    }

    init(x,y,w,h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.r = 1;
    }

    InBox(mx,my) {
        return (mx>this.x & mx<(this.x+this.w) & my>this.y & my<(this.y+this.h));
    }

    Ratio(mx) {
        this.r = ((mx-this.x)/this.w);
        return this.r;
    }

    setRatio(r) {
        this.r = r;
    }

    show() {
        let w;
        const a=7;
        strokeWeight(1);
        switch (this.mode) {
            case BAR:
                fill("#3700B3");noStroke();
                w = this.w * this.r;
                rect(this.x,this.y, w,this.h,a,0,0,a);
                fill("#63DAC5");noStroke();
                rect(this.x+w,this.y, this.w-w,this.h,0,a,a,0);
                break;
            case CURSEUR:
                w = this.w * this.r;
                fill(3*16+7,0, 11*16+3,120)
                rect(this.x,this.y,this.w,this.h);
                stroke("#63DAC5");noFill();strokeWeight(6);
                strokeWeight(1);fill("#63DAC5");
                beginShape();
                vertex(this.x+w,this.y+3);
                vertex(this.x+w+4,this.y+10);
                vertex(this.x+w-4,this.y+10);
                endShape(CLOSE);
                break;
        }

    }
}

class VERTMOUSE {
    constructor(mode=CURSEUR_D) {
        this.mode = mode
    }

    init(x,y,w,h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    InBox(mx,my) {
        return (mx>this.x & mx<(this.x+this.w) & my>this.y & my<(this.y+this.h));
    }

    Ratio(my) {
        this.r = ((my-this.y)/this.h);
        return this.r;
    }

    setRatio(r) {
        this.r = r;
    }

    show() {
        fill(3*16+7,0, 11*16+3,120)
        rect(this.x,this.y,this.w,this.h,10);
        let w;
        switch (this.mode) {
            case CURSEUR_D:
                w = this.h * this.r; 
                 strokeWeight(1);fill("#63DAC5");
                beginShape();
                    vertex(this.x,this.y+w);
                    vertex(this.x+10,this.y+w+4);
                    vertex(this.x+10,this.y+w-4);
                endShape(CLOSE);
                break;
            case CURSEUR_G:
                strokeWeight(1);fill("#63DAC5");
                w = this.h * this.r;
                beginShape();
                    vertex(this.x+10,this.y+w);
                    vertex(this.x,this.y+w+4);
                    vertex(this.x,this.y+w-4);
                endShape(CLOSE);
                break;
        }
    }
}