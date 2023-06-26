const eC = {version: 'r01'};

let circles = [];
let img;
let maxR = -1;

function windowResized(){
	resizeCanvas(windowWidth,windowHeight);
	background(0);
	console.log('resize');
}

function preload() {
	console.log('preload');
	img = loadImage('2021.png');
}

function setup() {
	// createCanvas(windowWidth,windowHeight);
	createCanvas(img.width,img.height);
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");

	// circles.push(new Circle(random(width),random(height)));
	colorMode(HSB);
	pixelDensity(1);

}

function draw() {
	background(0);

	// image(img,0,0,width,height);
	img.loadPixels();
	for (let i = 0; i<27; i++) {
		let x = floor(random(width));
		let y = floor(random(height));
		let v = new Circle(x,y);
		let id = ((x + y*img.width) * 4);
		let b = (img.pixels[id] +img.pixels[id+1] +img.pixels[id+2])/3 >1;
		// console.log(b);
		let ok = true;
		for (let t of circles) {
			if (t.neighbour(v)) {
				ok = false;
				break;
			}
		}
		if (ok && b) circles.push(v);
	}

	for (let c of circles) {
		let ok=true;
		for (let t of circles) {
			if (c != t && c.neighbour(t)) {
				ok = false;
				break;
			}
		}
		if (!c.edges() && ok ) c.grow();
		c.show();
	}
}



//----------------
class Circle {
	constructor(x_,y_) {
		this.pos = createVector(x_,y_);
		this.r = 1;
	}

	edges() {
		return (  this.pos.x<this.r || this.pos.x > width-this.r || this.pos.y < this.r || this.pos.y> height-this.r);
	}

	neighbour(o_) {
		let d = p5.Vector.dist(this.pos,o_.pos);
		return ( d < this.r+o_.r );
	}

	grow() {
		this.r += 0.2;
		if (this.r > maxR) maxR=this.r;
	}

	show() {
		noFill();
		let color = map(this.r,1,maxR,0,360);
		stroke(color,255,255);
		strokeWeight(2);
		circle(this.pos.x,this.pos.y,2*this.r-2);
	}
}