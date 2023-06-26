const eC = {version: 'r01'};
const LEVEL = 14
let init_base;
let bases = [];
let steps = [];
let iter=0;
let angle;

function setup() {
	createCanvas(600,400);
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
	init_base = {a: 0, pos : createVector(4*width/12,height-50) , l: width/8};
	bases.push(init_base);
	angle = PI/3.3;
}

function draw() {
	background(255);
	noFill(); stroke(255); strokeWeight(3);
	for(b of bases) {
		steps.push(new Step(b,iter));
	}
	bases = [];
	for (s of steps) {
		s.show();
		if (s.level === iter) {
			let b = s.next();
			bases.push(b[0]);
			bases.push(b[1]);
		}
	}
	iter++;
	if(iter>LEVEL)	noLoop();
}

//----------------------------------------------------
class Step {
	constructor(base,level) {
		this.level = level;
		this.a = base.a;
		this.l = base.l;
		this.p = [];
		this.p.push(base.pos);
		this.p.push(p5.Vector.fromAngle(base.a).setMag(base.l).add(base.pos));
		this.p.push(p5.Vector.fromAngle(base.a-PI/2).setMag(base.l).add(this.p[1]));
		this.p.push(p5.Vector.fromAngle(base.a-angle - PI/2).setMag(abs(this.l * cos(angle-PI/2))).add(this.p[2]));
		this.p.push(p5.Vector.fromAngle(base.a-PI).setMag(base.l).add(this.p[2])); 
	}

	next() {
		let a1 = this.a - angle; 
		let a2 = this.a - angle +PI/2; 
		let l1 = abs(this.l * cos(angle));
		let l2 = abs(this.l * cos(angle-PI/2))
		let pos1 = this.p[4];
		let pos2 = p5.Vector.fromAngle(a1).setMag(l1).add(pos1);
		return [{a: a1, l: l1, pos: pos1},{a: a2, l: l2, pos: pos2}];
	}

	show() {
		push();
		noStroke(); //noFill();
		let c1 = color(0x73,0x2F,0x23);
		let c2 = color(0x96,0xCF,0x33);
		let c = lerpColor(c1,c2,this.level/LEVEL);
		fill(c);
		strokeWeight(1);
		beginShape();
		for (let p of this.p) {
			vertex(p.x,p.y);
		}
		endShape(CLOSE);
		pop();
	}
}
