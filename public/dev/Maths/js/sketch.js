const eC = {version: 'v0.01', release:'r0', date:'nov/23', owner: 'rky', code:'y2H', annee:'2023', maj:'nov/23'};
let mobile;
let DEBUG = true;
let cercles = [];
let rectangles = [];

function windowResized() {
    let m = min(innerHeight,innerWidth);
    let w_ = int(m*0.8) - 10;
    resizeCanvas(innerWidth-4,innerHeight-100);
}


function keyPressed() {
    if (key=='d') {
        DEBUG = ! DEBUG;
    }
}

function mousePressed() {
}

function setup() {
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    canvas = createCanvas(10,10); // mise en place du ratio 0.59
    canvas.parent("#canvas");
    windowResized();

    cercles.push(new formCercle(new Vector(200,400),120));
    cercles.push(new formCercle(new Vector(850,200),160));
    cercles.push(new formCercle(new Vector(700,600),100));
    rectangles.push(new formRect(new Vector(320,110),new Vector(120,80)));
    rectangles.push(new formRect(new Vector(width/2,height/2),new Vector(60,40)));
}

function  draw() {
    background(52);

    let d=Infinity;
    let m = new Vector(mouseX, mouseY);
    for (let c of cercles) {
        c.show();
        let dd = c.SDF(m);
        if (dd<d) d=dd;
    }
    for (let r of rectangles) {
        r.show();
        let dd = r.SDF(m);
        if (dd<d) d=dd;
    }

    fill(255,255,0,30);stroke(255,255,0);
    circle(m.x,m.y,d);
}
