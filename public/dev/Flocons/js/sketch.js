const eC = {version: 'r01'};
let current;
let particules = [];
function windowsResized(){
	resizeCanvas(windowWidth,windowHeight);
}

function setup() {
	// createCanvas(windowWidth,windowHeight);
	createCanvas(256,256);
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
	current = new Particule(createVector(width/2,0));
}

function draw() {
	background(0);
	translate(width/2,height/2);

	while (!current.isFin() && !current.intersect()) {
	// if (current.isFin() || current.intersect()) {
		current.update();
	}
	particules.push(current);
	current = new Particule(createVector(width/2,0));
	
	for (let i =0; i<6 ; i++) {
		rotate(PI/3);
		current.show();
		for (p of particules) {
			p.show();
		}
		push();
		scale(1,-1);
		current.show();
			for (p of particules) {
			p.show();
		}
		pop();
	}
}



//------------
class Particule {
	constructor(pos_) {
		this.pos = pos_;
	}

	update() {
		this.pos.x -= 1;
		this.pos.y += random(-5,5);
		this.angle = this.pos.heading();
		this.angle = constrain(this.angle,0,PI/6);
	}

	intersect() {
		let ret = false;
		for (p of particules) {
			let d = p5.Vector.dist(this.pos,p.pos);
			if (d<2) {
				ret = true;
				break;
			}
		}
		return ret;
	}

	show() {
		stroke(255);
		strokeWeight(1);
		point(this.pos.x,this.pos.y);
	}

	isFin() {
		return this.pos.x<0;
	}
}
