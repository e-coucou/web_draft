const eC = {version: 'v0.01', release:'r0', date:'nov/23', owner: 'rky', code:'y2H', annee:'2023', maj:'nov/23'};
let mobile;
let DEBUG = true;
let cercles = [];
let rectangles = [];
let scene = [];
let lampe, ray, points = [];
let angle = 45;

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
    lampe.set(mouseX,mouseY);
}

function setup() {
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    canvas = createCanvas(10,10); // mise en place du ratio 0.59
    canvas.parent("#canvas");
    windowResized();

    HG = new Vector(0,0);
    HD = new Vector(width,0);
    BD = new Vector(width,height);
    BG = new Vector(0,height);

    scene.push(new formMur(HG,HD));
    scene.push(new formMur(HD,BD));
    scene.push(new formMur(BD,BG));
    scene.push(new formMur(BG,HG));
    scene.push(new formCercle(new Vector(200,400),120));
    scene[4].setColor(color(0,255,0));
    scene.push(new formCercle(new Vector(850,200),160));
    scene.push(new formCercle(new Vector(700,600),100));
    scene.push(new formRect(new Vector(320,110),new Vector(120,80)));
    scene.push(new formRect(new Vector(width/2,height/2),new Vector(60,40)));
    scene.push(new formMur(new Vector(width/2,height), new Vector(width/2+100,height-100)));

    lampe = new Vector(300,height*0.8);
    ray = new Ray(lampe,-45);
}
function lightScene() {
    for (let a=0;a<360;a+=0.2) {

    }
}
function  draw() {
    background(52);

    // let m = new Vector(mouseX, mouseY);
    // dir = Vector.sub(m,lampe);
    // angle = Math.atan2(dir.y,dir.x)*360/TWO_PI;
    ray = new Ray(lampe,angle);
    ray.show();

    let d,intersection;
    intersection = lampe.copie();
    let reach = false;
    while ( !reach) 
    {
        d=Infinity;
        for (let o of scene) {
            o.show();
            let dd = o.SDF(intersection);
            if (dd<d) d=dd;
        }
        if (d<Infinity) {
            fill(255,255,0,30);stroke(255,255,0);
            circle(intersection.x,intersection.y,d);
            intersection.add(ray.getMag(d));
            // console.log(points,d)
            fill(255);
            circle(intersection.x,intersection.y,2);
        }
        // if (d<0.1 | intersection.x<0 | intersection.x>width | intersection.y<0 | intersection.y>height) {
        if (d<0.1) {
                reach = true;
            points.push(intersection);
        }
    }
    // for (let r of rectangles) {
    //     r.show();
    //     let dd = r.SDF(m);
    //     if (dd<d) d=dd;
    // }

    for (let p of points) {
        p.showPxl();
    }

    lampe.showPt(3);
    angle -= 0.1;
    if (angle < -180) {
        angle = 45;
        points = [];
    }
}
