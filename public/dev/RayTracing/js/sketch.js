const eC = {version: 'r01'};
let murs = [];
let ray;
let particules = [];
let pt=[];
let uPt=[];
let nbP = 10;
let img, mask;

function preload() {
    img = loadImage('foreground.png');
}

function setup() {
    let canvas = createCanvas(800,400);
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    // Polygon #1
	let Px = [
    {a:{x:100,y:150}, b:{x:120,y:50}},
	{a:{x:120,y:50}, b:{x:200,y:80}},
	{a:{x:200,y:80}, b:{x:140,y:210}},
	{a:{x:140,y:210}, b:{x:100,y:150}},
	// Polygon #2
    {a:{x:100,y:200}, b:{x:120,y:250}},
	{a:{x:120,y:250}, b:{x:60,y:300}},
	{a:{x:60,y:300}, b:{x:100,y:200}},
	// Polygon #3
	{a:{x:200,y:260}, b:{x:220,y:150}},
	{a:{x:220,y:150}, b:{x:300,y:200}},
	{a:{x:300,y:200}, b:{x:350,y:320}},
	{a:{x:350,y:320}, b:{x:200,y:260}},
	// Polygon #4
	{a:{x:340,y:60}, b:{x:360,y:40}},
	{a:{x:360,y:40}, b:{x:370,y:70}},
	{a:{x:370,y:70}, b:{x:340,y:60}},
	// Polygon #5
	{a:{x:600,y:220}, b:{x:710,y:200}},
	{a:{x:710,y:200}, b:{x:690,y:300}},
	{a:{x:690,y:300}, b:{x:580,y:320}},
	{a:{x:580,y:320}, b:{x:600,y:220}},
	// Polygon #6
	{a:{x:530,y:95}, b:{x:710,y:50}},
	{a:{x:710,y:50}, b:{x:610,y:150}},
	{a:{x:610,y:150}, b:{x:530,y:95}},
    // Bords
	{a:{x:0,y:0}, b:{x:width,y:0}},
	{a:{x:width,y:0}, b:{x:width,y:height}},
	{a:{x:width,y:height}, b:{x:0,y:height}},
	{a:{x:0,y:height}, b:{x:0,y:0}}
    ]
    for (let m of Px) {
        murs.push(new Mur(m.a.x,m.a.y,m.b.x,m.b.y));
        pt.push(createVector(m.a.x, m.a.y));
        pt.push(createVector(m.b.x, m.b.y));
    }

    // uPt = [... new Set(pt)];
    let t={};
    uPt = pt.filter(e=>!(t[e]=e in t)) ;
    // ray = new Ray(100,200);
    for (let i=0; i<nbP; i++) {
        particules.push( new Particule() );
    }

    mask = createImage(width, height);
    // colorMode(HSB);
}

function draw() {
    background(0);

    image(img,0,0,width,height);
    // ray.setDir(mouseX,mouseY);
    for (mur of murs) {
        mur.show();
    }
    // particule.update(width/2, height/2);
        particules[0].update(mouseX, mouseY);
        particules[0].lookAt(murs, uPt);
        particules[0].show();
    for (let i=1; i<nbP; i++) {
        let particule = particules[i];
        let dx = Math.cos(Math.PI*(i-1)/(nbP-1)*2) * 8;
        let dy = Math.sin(Math.PI*(i-1)/(nbP-1)*2) * 8;
        particule.update(mouseX+dx, mouseY+dy);
        particule.lookAt(murs, uPt);
        particule.show();
    }

    for (let p of particules) {
        p.showDot();
    }
    // ray.show();
    // particule.lineShow(pt);
    // let point = ray.cast(murs);
    // if (point) {
    //     stroke(255);
    //     circle(point.x,point.y,4);
    // }
}