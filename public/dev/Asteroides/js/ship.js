class Ship {
	constructor() {
		this.pos = createVector(width/2,height/2);
		this.vel = createVector(0,0);
		this.r = 20;
		this.direction = 0;
		this.rot = 0;
		this.boost = false;
		this.life = 100;
		this.hit = false;
	}

	isHit(astre) {
		this.hit = false;
		let d = dist(this.pos.x,this.pos.y,astre.pos.x,astre.pos.y);
		if (d < this.r+astre.rI) {
			this.hit = true;
			this.life -= astre.rI / 20;
		}
		return this.hit;
	}

	setRotation(a) {
		this.rot = a;
	}

	turn() {
		this.direction += this.rot;
	}

	setBoost(v) {
		this.boost = v;
	}
	update() {
		if (this.boost) {
			let f= p5.Vector.fromAngle(this.direction);
			f.mult(0.5);
			this.vel.add(f);
		}
		this.pos.add(this.vel);
		this.vel.mult(0.98);
	}

	edges() {
		if (this.pos.x > width || this.pos.x <0 ) { this.direction = PI - this.direction; this.vel.x *= -1; }
		if (this.pos.y > height || this.pos.y < 0){ this.direction = TWO_PI - this.direction ; this.vel.y *= -1; }

		this.direction %= TWO_PI;
	}

	show() {
		let e = map(this.life,0,100,255,0);
		let c = color(e,10,255-e);
		push();
		translate(this.pos.x, this.pos.y);
		rotate(this.direction +PI/2);
		// fill(this.hit?color(255,255,255):c); noStroke(); //stroke(255);
		// beginShape();
		// vertex(0,0);
		// vertex(-this.r/3,this.r);
		// vertex(this.r/3,this.r);
		// endShape(CLOSE);
		image(imgShip,-18,-17,36,35);
		pop();
	}
}


class Laser {
	constructor(pos,angle) {
		this.pos = pos.copy();
		this.vel = p5.Vector.fromAngle(angle);
		this.vel.mult(5);
	}

	update() {
		this.pos.add(this.vel);
	}

	isHit(astre) {
		let h=false;
		let d = dist(this.pos.x,this.pos.y,astre.pos.x,astre.pos.y);
		if (d<=astre.rI) h = true;
		return h;
	}

	isEdges() {
		let out = false;
		if (this.pos.x > width || this.pos.x <0 || this.pos.y <0 || this.pos.y > height) { out = true;}
		return out;
	}

	show() {
		push();
		noFill(); stroke(255,0,0); strokeWeight(4);
		point(this.pos.x,this.pos.y);
		pop();
	}
}