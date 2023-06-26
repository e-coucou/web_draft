const eC = {version: 'r02'};
let current;
let flocons = [];
let w=32;
let cols=10,rows=10;
let selId = 0;
function windowsResized(){
	resizeCanvas(windowWidth,windowHeight);
}

function mousePressed() {
	let i = floor(mouseX/w); 
	let j = floor(mouseY/w);
	selId = i*cols + j;
	// console.log(i,j,flocons[selId]);
}

function setup() {
	// createCanvas(windowWidth,windowHeight);
	createCanvas(cols*w*2,rows*w);
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
	for(let i=0;i<cols;i++) {
		for(let j = 0;j<rows;j++) {
			flocons.push( new Flocon(w,createVector(i*w,j*w),floor(random(1,7))) );
		}
	}
}

function draw() {
	background(0);

	for (let f of flocons) {
		if (!f.end) f.update();
		f.show();
	}
	
	let f = flocons[selId];
	push();
	translate(3*cols*w/2-f.pos.x,rows*w/2-f.pos.y);
	// scale(2,-2);
	f.show();
	pop();
}

//------------
class Flocon {
	constructor(w_,pos_,alea_) {
		this.w = w_;
		this.particules = [];
		this.pos = pos_.add(createVector(this.w/2,this.w/2));
		this.alea = alea_
		this.current = new Particule(createVector(this.w/2,0),this.alea);
		this.end = false;
	}

	update() {
		while (!this.current.isFin() && !this.current.intersect(this.particules)) {
			this.current.update();
		}
		this.particules.push(this.current);
		if (this.current.pos.x === w/2 && this.current.pos.y === 0) { 
			this.end = true;
		}
		this.current = new Particule(createVector(w/2,0),this.alea);
	}

	show() {
		push();
		translate(this.pos.x,this.pos.y);
		stroke(255);
		strokeWeight(1);
		for (let i =0; i<6 ; i++) {
			rotate(PI/3);
			this.current.show();
			for (let p of this.particules) {
				p.show();
			}
			push();
			scale(1,-1);
			this.current.show();
			for (let p of this.particules) {
				p.show();
			}
			pop();
		}
		pop();
	}
}


//------------
class Particule {
	constructor(pos_,alea_) {
		this.pos = pos_;
		this.alea = alea_;
	}

	update() {
		this.pos.x -= 1;
		this.pos.y += random(-this.alea,this.alea);
		this.angle = this.pos.heading();
		this.angle = constrain(this.angle,0,PI/6);
	}

	intersect(particules) {
		let ret = false;
		for (let p of particules) {
			let d = p5.Vector.dist(this.pos,p.pos);
			if (d<2) {
				ret = true;
				break;
			}
		}
		return ret;
	}

	show() {
		// stroke(255);
		// strokeWeight(1);
		point(this.pos.x,this.pos.y);
	}

	isFin() {
		return this.pos.x<0;
	}
}
