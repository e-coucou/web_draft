const eC = {version: 'v0.01', release:'r0', date:'nov/23', owner: 'rky', code:'y2H', annee:'2023', maj:'nov/23'};
let mobile;
let DEBUG = true;

let murs = [];
let particule;
let seg=[];
let itSeg=0;

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
    if (seg.length==2 || seg.length==0) {
        seg = [];
        seg.push( {x:mouseX, y:mouseY});
    } else {
        seg.push( {x:mouseX, y:mouseY});
        murs.push( new Segment(seg[0], seg[1]));
    }
}

function setup() {
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    canvas = createCanvas(10,10); // mise en place du ratio 0.59
    canvas.parent("#canvas");
    windowResized();

    particule = new Particule({x:width/2, y:height/2});
    murs.push( new Segment({x:0,y:0},{x:0,y:height}));
    murs.push( new Segment({x:0,y:0},{x:width,y:0}));
    murs.push( new Segment({x:width,y:0},{x:width,y:height}));
    murs.push( new Segment({x:0,y:height},{x:width,y:height}));
    murs.push( new Segment({x:100,y:200},{x:700,y:100}));
}

function  draw() {
    background(52);

    particule.update({x:mouseX, y:mouseY});
    for (let mur of murs) {
        mur.show();
    }
}
