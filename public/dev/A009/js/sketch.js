let eC = {version: 'r01'};
let attractors = [];
let particules = [];

function setup() {
	createCanvas(400,400);
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
	// for (let i = 0; i< 10; i++) {
	// 	attractors[i] = createVector(random(width),random(height));
	// }
	for (let i = 0; i< 100; i++) {
		particules[i] = new Particule(random(width),random(height));
	}
}

function mousePressed() {
		attractors.push(createVector(mouseX,mouseY));
}

function draw() {
	background(51);
	stroke(255,0,0);
	strokeWeight(4);

	for (let a of attractors) {
		point(a.x,a.y);
	}
	for (p of particules) {
		for (a of attractors) {
			p.attracted(a); 
		}
		p.update();
		p.show();
	}

}
//-------------
//    ಠ_ಠ   (ง'̀-'́)ง
//------------------------------------------------------------------
class Particule {
	constructor(x,y) {
		this.pos = createVector(x,y);
		this.prev = this.pos;
		// this.vel = p5.Vector.random2D();
		// this.vel.setMag(random(2,5));
		this.vel = createVector();
		this.acc = createVector();
	}
	update() {
		this.prev = this.pos.copy();
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.mult(0);
	}
	show() {
		push();
		// translate(this.pos.x,this.pos.y);
		stroke(255,255);
		strokeWeight(4);
		line(this.pos.x,this.pos.y,this.prev.x,this.prev.y);
		pop();
	}

	attracted(cible) {
		let force = p5.Vector.sub(cible,this.pos);
		let dSquare = force.magSq();
		dSquare = constrain(dSquare,10,500);
		const G = 10; // 6.67408;
		let intensite = G/(dSquare);
		force.setMag(intensite);
		this.acc.add(force);
	}
}