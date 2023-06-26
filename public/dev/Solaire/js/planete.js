class Planete {
	constructor(r,d,p) {
		this.r = r;
		this.angle = random(0,TWO_PI);
		this.d = d; //distance parent
		this.speed = random(0.001, 0.01);
		this.p = p;

	}

	move() {
		this.angle += this.speed;
	}
	show() {
		fill(255);
		noStroke();
		push();
		if (this.p !== undefined) {
			let x = this.p.d*cos(this.p.angle);
			let y = this.p.d*sin(this.p.angle);
			let z=0;
			translate(x,y,z);
		} else {
		}

		rotateZ(this.angle);
		// rotateY(PI/5);
		translate(this.d,0,0);
		sphere(this.r);
		pop();
	}
}