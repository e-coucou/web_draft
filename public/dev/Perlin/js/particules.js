function Particule() {
	this.pos = createVector(random(width),random(height));
	this.vit = createVector(0,0); //p5.Vector.random2D();
	this.acc = createVector(0,0);
	this.maxVit = 2;
	this.anc = this.pos.copy();

	this.update = function() {
		this.vit.add(this.acc);
		this.vit.limit(this.maxVit)
		this.pos.add(this.vit);
		this.acc.mult(0);
	}

	this.force = function(force) {
		this.acc.add(force);
	}

	this.show = function() {
		stroke(0,5);
		strokeWeight(1);
		// point(this.pos.x,this.pos.y);
		line(this.pos.x,this.pos.y,this.anc.x,this.anc.y);
		//  fill(0,0,255);
		// circle(this.pos.x,this.pos.y,2);
		this.updtAnc();
	}

	this.updtAnc = function() {
		this.anc.x = this.pos.x;
		this.anc.y = this.pos.y;
	}
	this.bords = function() {
		if(this.pos.x>width) {
			this.pos.x=0;
			this.updtAnc();
		}
		if(this.pos.x<0) {
			this.pos.x=width-1;
			this.updtAnc();
		}
		if(this.pos.y>height) {
			this.pos.y=0;
			this.updtAnc();
		}
		if(this.pos.y<0) {
			this.pos.y=height-1;
			this.updtAnc();
		}
	}

	this.flow = function(vectors) {
		let x = floor(this.pos.x / scale);
		let y = floor(this.pos.y / scale);
		let index = x + y * cols;
		let  force = vectors[index]; 
		this.force(force);
	}
}