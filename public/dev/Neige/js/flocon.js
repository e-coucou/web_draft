class Flocon {
	constructor() {
		this.pos = createVector(random(width),random(-100,-10));
		this.vel = createVector(0,0);
		this.acc = createVector(0,0);
		this.img = random(pictures);
		this.angle = random(TWO_PI);
		this.dir = random(1) > 0.5 ? 1:-1;
		this.r = this.randomize();
	}

	randomize() {
		let r = pow(random(),4)*32;
		return constrain(r,4,32); 
	}

	update() {
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.mult(0);
		this.angle += this.dir * this.vel.mag()/100;

	}

	applyForce(force) {
		let f = force.mult(createVector(1,sqrt(this.r/10)));
		this.acc.add(f);
	}

	outScreen() {
		return this.pos.y>height+this.r;
	}

	show() {
		// noStroke(); fill(255);
		// circle(this.pos.x,this.pos.y,this.r);
		push();
		translate(this.pos.x,this.pos.y);
		rotate(this.angle);
		imageMode(CENTER);
		image(this.img,0,0,this.r,this.r);
		pop();
	}
}