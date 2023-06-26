class Canon {
	constructor() {
		this.x = width/2;
		this.y = height * 0.9;
		this.r = 10;
		this.acc= 5;
		this.vel = 0;
		this.isTir = false;
		this.laser;
	}

	move(dir_) {
		this.vel = dir_ * this.acc;
	}

	update() {
		this.x += this.vel;
		if (this.x > width - this.r ) this.x = width - this.r;
		if (this.x < this.r ) this.x = this.r;
		if (this.isTir) {
			this.laser.update();
			if (this.laser.edges() || this.laser.out) {
				this.laser = [];
				this.isTir = false;
			}
		}
	}

	tir() {
		if (!this.isTir) {
			this.isTir = true;
			this.laser = new Laser(createVector(this.x,this.y-10));
		}
	}

	show() {
		stroke(210,255,255); fill(210,255,255);
		beginShape();
		vertex(this.x,this.y);
		vertex(this.x+this.r,this.y+20);
		vertex(this.x-this.r,this.y+20);
		endShape(CLOSE);
		if (this.isTir) this.laser.show();
	}
}

//---------
class Laser {
	constructor(pos_) {
		this.pos = pos_;
		this.vel = createVector(0,-4);
		this.out = false;
	}

	update() {
		this.pos.add(this.vel);
	}

	edges() {
		return (this.pos.y < 0);
	}

	show() {
		stroke(0,255,255);
		strokeWeight(3);
		line(this.pos.x,this.pos.y,this.pos.x,this.pos.y-3);
	}
}




//---------

class Bunker {
	constructor(pos_) {
		this.pos = pos_;
		this.w = width /9;
		this.h = width /11;
	}

	show() {
		fill(0,0,255);
		beginShape();
		vertex(this.pos.x,this.pos.y+this.h);
		vertex(this.pos.x+this.w/4,this.pos.y+this.h);
		vertex(this.pos.x+this.w/4,this.pos.y+4/5*this.h);
		vertex(this.pos.x+this.w*3/4,this.pos.y+4/5*this.h);
		vertex(this.pos.x+this.w*3/4,this.pos.y+this.h);
		vertex(this.pos.x+this.w,this.pos.y+this.h);
		vertex(this.pos.x+this.w,this.pos.y+1/5*this.h);
		vertex(this.pos.x+4/5*this.w,this.pos.y);
		vertex(this.pos.x+1/5*this.w,this.pos.y);
		vertex(this.pos.x,this.pos.y+1/5*this.h);
		endShape(CLOSE);
	}
}