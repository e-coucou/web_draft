class Brique {
	constructor(pos,r,t) {
		this.pos = pos;
		this.r = r;
		this.t = t;
		this.col = color(random()*255,random()*255,random()*255);
	}

	show() {
		push();
		fill(this.col);
		noStroke(); //stroke(0,0,255);
		translate(this.pos.x,this.pos.y);
		beginShape();
		for(let i=0;i<this.t;i++) {
			let a = TWO_PI/this.t*(i+0.5);
			let x = this.r * cos(a);
			let y = this.r * sin(a);
			vertex(x,y);
		}
		endShape(CLOSE);
		pop();
	}
}