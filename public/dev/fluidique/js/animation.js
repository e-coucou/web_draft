let mouseP;

function mousePressed() {
    mouseP = createVector(mouseX/width*2-1,mouseY/height*2-1);
    console.log(densite(mouseP));
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

function drawVecteur() {
    let grille = [];
    for (let x=0; x<width; x += 5) {
        for (let y=0; y<height; y += 5) {
            let p=createVector(x/width*2-1,y/height*2-1);
            let d = proprieteGradrient(p);
            grille.push({x:x,y:y,d:d});
        }
    }
    noFill();
    for (let p of grille) {
        stroke(255,255,0);
        line(p.x,p.y,p.x+p.d.x,p.y+p.d.y);
    }    
}
function drawDensite() {
    let grille = [];
    let maxD = 0;
    for (let x=0; x<width; x++) {
        for (let y=0; y<height; y++) {
            let p=createVector(x/width*2-1,y/height*2-1);
            let d = densite(p);
            if (d>maxD) maxD = d;
            grille.push({x:x,y:y,d:d});
        }
    }
    // console.log(maxD);
    noFill();
    for (let p of grille) {
        let c = map(p.d/maxD,0,1,0,255);
        stroke(255);
        if (p.d > targetDensite*1.02) { 
            c = map(p.d,targetDensite,maxD,120,255);
            stroke(c,0,0);}
        if (p.d <= targetDensite*0.98) { 
            c = map(p.d,0,targetDensite,120,255);
            stroke(0,0,c);} 
        point(p.x,p.y);
    }
    // console.log(maxD,grille);

}