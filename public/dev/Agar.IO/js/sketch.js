const eC = {version: 'r01'};
let blobs = [];
let blob;
let zoom = 1;
function windowsResized(){
	resizeCanvas(windowWidth,windowHeight);
}

function setup() {
	// createCanvas(windowWidth,windowHeight);
	createCanvas(600,600);
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
	blob = new Blob(0,0,64)
	for (let i=0; i<200;i++) {
		let x = random(-width,width);
		let y = random(-height,height);
		blobs[i] = new Blob(x, y, random(8,16));
	}
}

function draw() {
	background(0);

	let newZoom = 64/blob.r;
	zoom = lerp(zoom,newZoom,0.1);
	translate(width/2,height/2);
	scale(zoom);
	translate(-blob.pos.x,-blob.pos.y);
	// translate(width/2-blob.pos.x, height/2-blob.pos.y);

	blob.update();
	blob.show();
	for (let i=blobs.length-1; i>=0 ;i--) {
		blobs[i].show();
		if (blob.eats(blobs[i])) {
			blobs.splice(i,1);
		}
	}
}


//---------------
class Blob {
	constructor(x_,y_,r_) {
		this.pos = createVector(x_,y_);
		this.vel = createVector(0,0);
		this.r = r_;
	}

	update() {
		let vel = createVector(mouseX-width/2,mouseY-height/2);
		vel.setMag(3);
		this.vel.lerp(vel,0.1);
		this.pos.add(this.vel);
	}

	eats(b) {
		let d = p5.Vector.dist(this.pos,b.pos);
		if (d<this.r+b.r) {
			let sum = PI*this.r*this.r + PI*b.r*b.r;
			this.r = sqrt(sum/PI);
			return true;
		} else {
			return false;
		}
	}

	show() {
		fill(255);
		noStroke();
		circle(this.pos.x,this.pos.y,2*this.r);
	}
}