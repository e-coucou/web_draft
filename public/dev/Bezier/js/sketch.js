const eC = {version: 'r01'};
let p0,p1 , c0;
let p=[];
let nbP=0;
let aff_line = 1, p_fige=0, p_mode = 0, aff_anim = 0;
let t_anim=0;

function mouseClicked() {
    let p0 = new Bounce(mouseX, mouseY, 0);
    p.splice(-1,0,p0);
    nbP++;
}

function keyPressed() {
    switch (keyCode) {
        case DOWN_ARROW:
            aff_line = (aff_line + 1)%2;
            break;
        case UP_ARROW:
            p_fige = (p_fige + 1)%2;
            break;
        case RIGHT_ARROW:
            p_mode = (p_mode + 1) %2;
            break;
        case LEFT_ARROW:
            aff_anim = (aff_anim + 1) %2;
            break;
    }
}
function setup() {
    let canvas = createCanvas(600,600);
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    console.log("%c BAS : Affiche lignes" ,"background: #ddd; color: #05f");
    console.log("%c HAUT : Fige les points" ,"background: #ddd; color: #05f");
    console.log("%c DROITE : Affiche les Points vs Vertex" ,"background: #ddd; color: #05f");
    console.log("%c GAUCHE : Animation de la construction" ,"background: #ddd; color: #05f");

    p0 = new Bounce(0,300,1);
    p.push(p0);
    // c0 = new Bounce(200,100);
    // c1 = new Bounce(300,300);
    // c2 = new Bounce(400,500);
    for (let i=0; i<nbP ; ++i) {
        let x = width/(nbP+1)*(i+1);
        let y = 300*( 1 + (0.5 + (i%2 * -1)));
        console.log(x,y);
        let c = new Bounce(x,y);
        p.push(c);
    }

    p1 = new Bounce(600,300);
    p.push(p1);

    colorMode(HSB);
}

function draw() {
    background(51);

    // c0.x = mouseX;
    // c0.y = mouseY;

    let inc = 0.02;

    strokeWeight(2);
    noFill();
    beginShape();
    for (let t=0; t<=1.00001 ; t += inc) {
        let v = Bezier(p,t);
        // let v0 = B_c(p0,c0,c1,c2,t);
        // let v1 = B_c(c0,c1,c2,p1,t);
        // let v = B_l(v0,v1,t);
        strokeWeight(4);
        stroke(255);
        strokeWeight(6);
        if (p_mode) {
            if (aff_anim && t==t_anim) {
                point(v.x,v.y);
            }
        } else {
            vertex(v.x,v.y);
        }
    }
    endShape();

    for (pt in p) {
        p[pt].update();
        p[pt].fige= p_fige;
        p[pt].show();
    }
    t_anim += inc;
    if (t_anim >1) t_anim=0;
    if (aff_anim) {
        frameRate(5);
    } else {
        frameRate(60); 
    }

    // noLoop();
}

function B(b0, b1, t) {
    return b0 + (b1 - b0)*t;
}

function B_l(b0, b1, t) {
    let x =  b0.x + (b1.x - b0.x)*t;
    let y =  b0.y + (b1.y - b0.y)*t;
    return createVector(x,y);
}

function B_q(b0, b1, b2, t) {
    let a0 = B_l(b0, b1, t);
    let a1 = B_l(b1, b2, t);
    strokeWeight(1);
    stroke(t*360,255,255);
    line(a0.x, a0.y, a1.x, a1.y);
    let a = B_l(a0,a1,t);
    return a;
}
function B_c(b0,b1,b2,b3,t) {
    let a0 = B_q(b0, b1, b2, t);
    let a1 = B_q(b1, b2, b3, t);
    let a = B_l(a0,a1,t);
    return a;
}

function Bezier(B,t) {
    // B is a array of Point where B0 and B1 are anchor 
    // console.log(B.length);
    if (B.length>2) {
        let B0 = B.slice(0,-1);
        let B1 = B.slice(1);
        let A0 = Bezier(B0,t);
        let A1 = Bezier(B1,t);
        if (aff_line) {
            strokeWeight(1);
            stroke(t*360,255,255);
            line(A0.x, A0.y, A1.x, A1.y);
        }
        if (aff_anim && t==t_anim) {
            strokeWeight(1);
            stroke(255);
            line(A0.x, A0.y, A1.x, A1.y);
        }
        return B_l(A0,A1,t);
    } else {
        if (aff_anim && t==t_anim) {
            strokeWeight(1);
            stroke(255);
            line(B[0].x, B[0].y, B[1].x, B[1].y);
        }
        return B_l(B[0],B[1],t);
    }
}