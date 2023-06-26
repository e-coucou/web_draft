class Paddle {
	constructor() {
		this.x = width/2;
		this.y = height - 40;
		this.w = 120;
		this.h = 18;
		this.moveL = false;
		this.moveR = false;
		this.m = 15;
	}

	update() {
		if (this.moveL) this.x -= this.m;
		if (this.moveR) this.x += this.m;
	}

	show() {
		beginShape();
		fill(255);noStroke();
		rectMode(CENTER);
		rect(this.x,this.y,this.w,this.h);
		endShape();
	}

	edges() {
		if (this.x<this.w/2) this.x = this.w/2;
		if (this.x>width-this.w/2) this.x = width-this.w/2;
	}
}