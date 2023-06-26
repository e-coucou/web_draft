class Asteroide {
	constructor(pos,rI) {
		if (pos == undefined) { 
			this.pos = createVector(random(0,width),random(0,height));
		} else {
			this.pos = pos.copy();
		}
		this.vel = p5.Vector.random2D();
		this.c = floor(random(20,50));

		if (rI== undefined) {
			this.rI = random(15,30);
		} else {
			this.rI =rI / 2;
		}
		this.r = [];
		for (let i=0; i<this.c;i++) {
			this.r[i] = this.rI * random(0.85,1.15);
		}
	}

	breakUP() {
		let a = [];
		a.push(new Asteroide(this.pos,this.rI));
		a.push(new Asteroide(this.pos,this.rI));
		return a;
	}

	update() {
		this.pos.add(this.vel);
	}

	edges() {
		if (this.pos.x > width || this.pos.x <0 ) {
			this.vel.x *= -1;
		} else if (this.pos.y > height || this.pos.y <0 ) {
			this.vel.y *= -1;
		} 
	}
	show() {
		push();
		translate(this.pos.x,this.pos.y);
		noFill(); stroke(255);
		beginShape();
		for (let i=0; i<this.c;i++) {
			let a = TWO_PI*i/this.c;
			vertex(this.r[i]*cos(a),this.r[i]*sin(a));
		}
		endShape(CLOSE);
		pop();
	}
}