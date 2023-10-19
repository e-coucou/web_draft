let collisionPerte = 0.6;
let blurRadius = 0.2;
let targetDensite= 5;
let pressionMult=0.5;

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
function blurKernelDerivee(rayon, dst) {
    if (dst>=rayon) return 0;
    let f = (rayon * rayon - dst * dst);
    let ech = - 24 / (PI * Math.pow(rayon,8));
    // console.log('ici',ech * dst * f * f);
    return (ech * dst * f * f);
}
function densite(t) {
    let d=0;
    for (let p of particules) {
        let pos = p.pos.copy();
        let dst = pos.dist(t); // console.log(dst)
        let influence = blurKernel(blurRadius,dst);
        d += influence *p.m;
    }
    return d;
}
function propriete(t) {
    let d = 0;
    for (let p of particules) {
        let pos = p.pos.copy();
        let dst = pos.dist(t);
        let influence = blurKernel(blurRadius,dst);
        d += p.propriete * influence * p.m / p.densite;
        // d += influence * p.m ;
    }
    return d;
}

function proprieteGradrient(t) {
    let propGradient = createVector(0,0);
    for (let p of particules) {
        let pos = p.pos.copy();
        let dst = pos.dist(t);
        if (dst != 0) {
            let dir = pos.sub(t);
            let slope = blurKernelDerivee(blurRadius,dst);
            dir.mult(-slope * p.m / p.densite /dst);
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
        let dst = pos.dist(t);
        if (dst != 0) {
            let dir = pos.sub(t);
            let slope = blurKernelDerivee(blurRadius,dst);
            dir.mult(-slope * p.m / p.densite /dst);
            dir.mult(DensiteTOPression(p.densite));
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
    return Math.cos( p.y-1 + Math.sin(p.x -1 ));
}

class Particule {
    constructor(x,y,c) {
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
    densite() {
        this.densite = densite(this.pos);
    }
    edge() {
        if (this.pos.x<this.r) {
            this.vel.x *= -collisionPerte;
            this.pos.x=this.r;
        }
        if (this.pos.x>width-this.r) {
            this.vel.x *= -collisionPerte;
            this.pos.x = width-this.r;
        }
        if (this.pos.y<this.r) {
            this.vel.y *= -collisionPerte;
            this.pos.y = this.r;
        }
        if ( this.pos.y>height-this.r) {
            this.vel.y *= -collisionPerte;
            this.pos.y = height -this.r;
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
    show() {
        fill(this.color);
        noStroke();
        let x = (this.pos.x + 1) * width / 2;
        let y = (this.pos.y + 1) * height / 2;
        circle(x, y,2*this.r*width);
    }
}