class Ball {
	constructor() {
		this.pos = createVector(random(width),random(height/2));
		this.vel = createVector(2,-2);
		this.acc = createVector(0,0);
		this.r = 20;
		this.vLimit = 10;

	}
	update() {
		this.vel.add(this.acc);
		this.vel.limit(this.vLimit);
		this.pos.add(this.vel);
		this.acc.mult(0);
	}
	addForce(f) {
		let force = createVector(0,0);
		force.add(this.vel).normalize().mult(f);
		this.acc.add(force);
		this.update();
	}

	edges() {
		if ( (this.pos.x<this.r && this.vel.x<0 ) || (this.pos.x>width-this.r && this.vel.x>0) ) this.vel.x *= -1;
		if (this.pos.y<this.r && this.vel.y<0) this.vel.y *= -1;
	}

	meet(p) {
		if(  this.pos.y>p.y-p.h/2-this.r && 
			(this.pos.x>p.x-p.w/2-this.r && this.pos.x<p.x+p.w/2+this.r) ) 
			{ this.vel.y *= -1;}
	}

	hits(b) {
		let d = dist(this.pos.x,this.pos.y,b.pos.x,b.pos.y);
		if (d < (this.r+b.r)) { return true;} else { return false;}
	}

	show() {
		beginShape();
		fill(120,180,80,200); noStroke();
		ellipseMode(CENTER);
		circle(this.pos.x,this.pos.y,this.r*2);
		endShape();
	}
}