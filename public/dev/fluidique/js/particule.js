let collisionPerte = 0.6;
let blurRadius = 0.2;
let targetDensite= 10;
let pressionMult=1.8;

function DensiteTOPression(d){
    let err = d - targetDensite;
    let pression = err * pressionMult;
    return pression;
}
function blurKernel(rayon, dst) {
    let volume = PI * Math.pow(rayon,8) / 4;
    let value =  max(0, rayon*rayon-dst*dst);
    return value*value*value / volume;
}
function blurKernel_v2(rayon, dst) {
    let volume = PI * Math.pow(rayon,8) / 4;
    let value =  max(0, rayon-dst);
    return value*value*value / volume;
}

function blurKernelDerivee(rayon, dst) {
    if (dst>=rayon) return 0;
    let f = (rayon * rayon - dst * dst);
    let ech = - 24 / (PI * Math.pow(rayon,8));
    // console.log('ici',ech * dst * f * f);
    return (ech * dst * f * f);
}
function CalculDensite(t) {
    let d=0;
    for (let p of particules) {
        let pos = p.pos.copy();
        let dst = pos.sub(t).mag(); // console.log(dst)
        let influence = blurKernel(blurRadius,dst);
        // console.log(influence)
        d += influence *p.m;
    }
    return d;
}
function CalculPropriete(t) {
    let d = 0;
    for (let p of particules) {
        let pos = p.pos.copy();
        let dst = pos.sub(t).mag();
        let influence = blurKernel(blurRadius,dst);
        // let densite = CalculDensite(p.pos);
        d += p.propriete * influence * p.m / p.densite;
        // d += influence * p.m ;
    }
    if (d>maxD) maxD=d;
    return d;
}

function CalculProprieteGradrient(t) {
    let propGradient = createVector(0,0);
    for (let p of particules) {
        let pos = p.pos.copy();
        let dir = pos.sub(t);
        let dst = dir.mag();
        if (dst != 0) {
            let slope = blurKernelDerivee(blurRadius,dst);
            dir.mult(slope * p.m / p.densite /dst);
            dir.mult(p.propriete);
            propGradient.add(dir);
        }
    }
    return propGradient;
}

function pressionForce(t) {
    let pressionF = createVector(0,0);
    for (let p of particules) {
        let pos = p.pos.copy();
        let dst = pos.sub(t).mag();
        if (dst != 0) {
            let dir = pos.sub(t);
            let slope = blurKernelDerivee(blurRadius,dst);
            dir.mult(slope * p.m / p.densite /dst);
            dir.mult(DensiteTOPression(p.densite)/1000);
            pressionF.add(dir);
        }
    }
    return pressionF;
}

function simulationStep() {
    for (let i=0; i<particules.length; i++) {

    }
}

function proprieteUnit(p) {
    return Math.cos( p.y -3 * Math.sin(p.x ));
}

class Particule {
    constructor(x,y,c,i) {
        this.id=i;
        this.pos = createVector(x,y);
        this.vel = createVector(0,0);
        this.acc = createVector(0,0);
        this.color=c;
        this.r=size/width;
        this.m = 1; //masse
        this.propriete = proprieteUnit(this.pos);
    }
    applyForce(f) {
        this.acc.add(f);
    }
    initDensite() {
        this.densite = CalculDensite(this.pos);
    }
    edge() {
        // let rr=this.r/width;
        if (this.pos.x<-1) {
            this.vel.x *= -1 * collisionPerte;
            this.pos.x=-1;
        }
        if (this.pos.x>1) {
            this.vel.x *= -1 * collisionPerte;
            this.pos.x = 1;
        }
        if (this.pos.y<-1) {
            this.vel.y *= -1 * collisionPerte;
            this.pos.y = -1;
        }
        if ( this.pos.y>1) {
            this.vel.y *= -1 * collisionPerte;
            this.pos.y = 1;
        }
    }
    update() {
        let g=createVector(0,0.1);
        this.applyForce(g);
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
        this.edge();
        this.show();
    }
    simulation() {
        let g=createVector(0,0.003);
        this.applyForce(g);
        this.Calculdensite();
        let pressionF = pressionForce(this.pos);
        let pressionAcc = pressionF.mult(1/this.densite); //console.log(pressionAcc.x, pressionAcc.y);
        // this.vel = (this.acc.copy());
        this.vel.add(this.acc);
        this.vel.add(pressionAcc);
        // this.vel = pressionAcc.copy();
        this.pos.add(this.vel);
        this.acc.mult(0);
        this.edge();
        this.show();
    }

    show() {
        // fill(this.color);
        noStroke();
        let x = (this.pos.x + 1) * width / 2;
        let y = (this.pos.y + 1) * height / 2;
        let c=255;
        if (this.densite > targetDensite) { 
            c = map(this.densite,targetDensite,maxD,120,255);
            fill(c,0,0);}
        if (this.densite <= targetDensite) { 
            c = map(this.densite,0,targetDensite,120,255);
            fill(0,0,c);} 
        circle(x, y,2*this.r*width);
    }
}