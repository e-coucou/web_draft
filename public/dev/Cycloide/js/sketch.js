const eC = {version: 'v0.01', release:'r0', date:'nov/23', owner: 'rky', code:'y2H', annee:'2023', maj:'nov/23'};
let mobile;
let DEBUG = true;

let dt, pt,roue,centre, path=[];
let A,B;


function windowResized() {
    let m = min(innerHeight,innerWidth);
    let w_ = innerWidth*0.98;
    let h_ = w_ * 9.0 / 16.0;
    resizeCanvas(w_,h_);
}


function keyPressed() {
    if (key=='d') {
        DEBUG = ! DEBUG;
    }
}

function mousePressed() {
}

function cycloide(t,R) {
    let x = R * (t - Math.sin(t));
    let y = R * (1 - Math.cos(t));
    return [x,y,0];
}


function setup() {
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    canvas = createCanvas(10,10); // mise en place du ratio 0.59
    canvas.parent("#canvas");
    windowResized();
    pt = new Vector(0,100,0);
    centre = new Vector(100,height/2,0);
    roue = new Roue(centre,pt);
    dt = 0;
    A = new Vector(100,height/2-100);
    B = new Vector( 100 + 100 * 2*TWO_PI/3 + 100 * Math.cos(-2*TWO_PI/3 - PI/2), height/2 + Math.sin(-PI/2 - 2*TWO_PI/3)*100);
}

function draw() {
    background(51);

    dt += 0.01;
    path.push(roue.update(dt));
    roue.show();
    for (let p of path) {
        fill(255,255,0,120);
        noStroke();
        circle(p.x(),p.y(),1);
    }
    if (dt>2*TWO_PI/3) {
        dt = 0;
        // path = [];
    }

    let [x,y,z] = cycloide(dt,100);
    fill(0,0,255);
    circle(x+100,y+height/2-100,10);

    fill(255,0,0);
    circle(A.x(),A.y(),5);
    circle(B.x(),B.y(),5);
    stroke(120,255,120);
    line(A.x(),A.y(),B.x(),B.y());

}