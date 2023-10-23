let mouseP;
let grille = [];

function mousePressed() {
    mouseP = createVector(mouseX/width*2-1,mouseY/height*2-1);
    console.log(CalculDensite(mouseP));
    for (let p of particules) {
        p.color = color(0);
    }
    recherchePoint(mouseP,blurRadius/2);
}

function showBlur() {
    stroke(255,255,0);
    strokeWeight(2);
    noFill();
    circle((mouseP.x+1)*width/2, (mouseP.y+1)*height/2, blurRadius*width);
}

function drawArrow(base, dest, couleur) {
    let vec =dest.sub(base); 
    push();
    stroke(couleur);
    strokeWeight(1);
    fill(couleur);
    // console.log(base.toString())
    translate(base.x, base.y);
    line(0, 0, vec.x, vec.y);
    rotate(vec.heading());
    let arrowSize = 2;
    translate(vec.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
  }

function drawVecteur() {
    let grille = [];
    for (let x=0; x<width; x += 10) {
        for (let y=0; y<height; y += 10) {
            let p=createVector(x/width*2-1,y/height*2-1);
            let d = CalculProprieteGradrient(p);
            let v = createVector(x,y);
            let f = v.add(d);
            grille.push({b:v,f:f});
        }
    }
    noFill();
    for (let p of grille) {
        stroke(255,255,0);
        line(p.b.x,p.b.y,p.f.x,p.f.y);
        fill(255,255,0);
        circle(p.b.x,p.b.y,2);
        // drawArrow(createVector(p.x,p.y),createVector(p.x+p.d.x, p.y+p.d.y), color(255,255,0));
        // drawArrow(p.b,p.f,color(255,255,0));
    }    
}
function drawDensite() {
    grille = [];
    for (let x=0; x<width; x+=1) {
        for (let y=0; y<height; y+=1) {
            let p=createVector(x/width*2-1,y/height*2-1);
            let d = CalculDensite(p);
            grille.push({x:x,y:y,d:d});
            if (d>maxD) maxD = d;
        }
    }
    // console.log(maxD);
    noFill();
    for (let p of grille) {
        let c = map(p.d/maxD,0,1,0,255);
        stroke(255);
        if (p.d > targetDensite*1.05) { 
            c = map(p.d,targetDensite,maxD,120,255);
            stroke(c,0,0);}
        if (p.d <= targetDensite*0.95) { 
            c = map(p.d,0,targetDensite,120,255);
            stroke(0,0,c);} 
        point(p.x,p.y);
    }
    // console.log(maxD,grille);

}

function drawProperty() {
    grille = [];
    let maxP=0
    for (let x=0; x<width; x+=1) {
        for (let y=0; y<height; y+=1) {
            let p=createVector(x/width*2-1,y/height*2-1);
            let d = CalculPropriete(p);
            grille.push({x:x,y:y,d:d});
            if (d>maxP) maxP = d;
        }
    }
    noFill();
    for (let g of grille) {
        let c = map(g.d/maxP,0,1,0,255);
        stroke(c);
        point(g.x,g.y);
    }
}

function drawExample() {
    grille = [];
    let maxP=0
    for (let x=0; x<width; x+=1) {
        for (let y=0; y<height; y+=1) {
            let c = x / width*2 - 1;
            let l = y / height*2 -1;
            let d = proprieteUnit(createVector(c,l));
            grille.push({x:x,y:y,d:d});
            if (d>maxP) maxP = d;
        }
    }
    noFill();
    for (let g of grille) {
        let c = map(g.d/maxP,0,1,0,255);
        stroke(c);
        point(g.x,g.y);
    }
}