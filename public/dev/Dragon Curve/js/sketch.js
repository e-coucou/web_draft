let pts = [];
let iter = 17;

function setup() {
    canvas = createCanvas(800,800);
    background(51);
    let p0 = createVector(0,0);
    pts.push(p0);
    let p1 = createVector(0,1);
    pts.push(p1);
    x=0; y=0;
    frameRate(1);
}
function nextPoint() {
    let pt = pts.slice();
    let nbPt = pt.length;
    const angle = 1*Math.PI / 2;
    for (let i=nbPt-2;i>=0; i-=1) {
        const p=pt[i];
        const p0 = pt[pt.length-1];
        let x = Math.cos(angle)*(p0.x - p.y) - Math.sin(angle) * (p0.y-p.y) + p0.x;
        let y = Math.sin(angle)*(p0.x - p.x) + Math.cos(angle) * (p0.y-p.y) + p0.y; 
        let newP = createVector(x,y);
        pts.push(newP);
    }
}

function draw() {
    if (iter<0) { noLoop();} else {
        background(0);
        stroke(255);
        let z = 400/(iter+1);
        for (let i=1; i<pts.length; i++) {
            let p0 = pts[i-1];
            let p1 = pts[i];
            let p0x = map(p0.x, -z,z,0,width);
            let p0y = map(p0.y, -z,z,height, 0);
            let p1x = map(p1.x, -z,z,0,width);
            let p1y = map(p1.y, -z,z,height, 0);
            strokeWeight(1);
            point(p1x,p1y);
            strokeWeight(1);
            line(p0x, p0y, p1x, p1y);
        }
        nextPoint();
    }
    iter--;

}