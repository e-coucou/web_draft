const eC = {version: 'r01'};
let murs = [];
let ray;
let particule;

function setup() {
    let canvas = createCanvas(400,400);
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    for (let i = 0; i<5 ; i++) {
        let x1 = random(width);
        let x2 = random(width);
        let y1 = random(height);
        let y2 = random(height);
        murs.push(new Mur(x1,y1,x2,y2));
    }
    // bordure
    murs.push(new Mur(0,0,width,0));
    murs.push(new Mur(width,0,width,height));
    murs.push(new Mur(width,height,0,height));
    murs.push(new Mur(0,height,0,0));
    // ray = new Ray(100,200);
    particule = new Particule()
}

function draw() {
    background(51);
    // ray.setDir(mouseX,mouseY);
    for (mur of murs) {
        mur.show();
    }
    particule.update(mouseX, mouseY);
    particule.lookAt(murs);
    particule.show();
    // ray.show();
    // let point = ray.cast(murs);
    // if (point) {
    //     stroke(255);
    //     circle(point.x,point.y,4);
    // }
}