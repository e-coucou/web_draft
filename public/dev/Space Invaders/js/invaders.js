class Invader {
	constructor(pos_,s_) {
		this.s = s_;
		this.pos = pos_;
		this.touche = false;
	}

	isTouche(pos_) {
		let d = p5.Vector.dist(pos_,this.pos);
		if (d<=this.s/2*1.7) {
			count--;
			this.touche= true;
			canon.laser.out = true;
			elements = Array(200).fill().map( l => new Element(this.pos));
		}
		return this.touche;
	}

	update(vel_) {
		this.pos.add(vel_);
	}

	show() {
		fill(150,255,255); noStroke();
		// if (this.touche) fill(255,0,0);
		square(this.pos.x-this.s/2,this.pos.y-this.s/2,this.s);
	}
}


//-----------

class Ligne {
	constructor(l_,s_) {
		this.s = s_;
		this.x = this.s/2+1;
		this.y = l_*this.s +this.s;
		this.vel = 1+(level/4);
		this.invaders;
		this.maxX=0;
		this.minX=this.x ;
		
		let l=0;
		this.invaders = Array(8).fill().map(p => new Invader(createVector(this.x+l++*s_,this.y),floor(this.s*0.8)));

	}

	setMax(val_) {
		this.maxX = val_;
	}

	setMin(val_) {
		this.minX = val_;
	}
	
	getMin() {
		this.minX = this.invaders.reduce((acc,i)=> i.pos.x < acc ? i.pos.x:acc , Infinity);
		return(this.minX);
	}
	getMax() {
		this.maxX = this.invaders.reduce((acc,i)=> i.pos.x > acc ? i.pos.x:acc , 0) + this.s;
		return(this.maxX);
	}
	update() {
		if (this.maxX<width+this.s/2 && this.minX > this.s/2) {
			this.invaders.forEach(a => a.update(createVector(this.vel,0)));
		} else {
			this.vel *= -1;
			this.y += this.s/2;
			this.invaders.forEach(a => a.update(createVector(this.vel,this.s/2)));
		}
	}

	show() {
		fill(200);
		stroke(255);
		this.invaders.forEach(a => a.show());
		// this.invaders.forEach(a => a.update());
	}
}

//------------------
class Soucoupe {
	constructor(s_) {
		let r = floor(random()+0.5);
		this.s = s_;
		this.vel = (2*r-1) * 1.5;
		this.pos = createVector(width*(1-r),this.s/2);
		this.touche = false;
	}
	isTouche(pos_) {
		let vC = p5.Vector.add(this.pos,this.s/2)
		let d = p5.Vector.dist(pos_,vC);
		if (d<=this.s) {
			this.touche = true;
			canon.laser.out = true;
			elements = Array(400).fill().map( l => new Element(vC));
		}
		return this.touche;
	}

	update() {
		this.pos.add(this.vel);
	}

	isEdges() {
		return (this.pos.x>width || this.pos.x<0);
	}

	show() {
		fill(60,255,255);
		noStroke();
		rect(this.pos.x,this.pos.y,this.s,this.s/2);
	}
}


//-----------------
class Element {
	constructor(pos_) {
		this.pos = pos_;
		this.vel = p5.Vector.fromAngle(random(TWO_PI),random(2,5));
		this.color = random(0,60);
		this.alive = true;

	}

	isAlive() {
		if (this.vel.mag() < 20) {
			this.alive = true;
		} else { this.alive = false;}
	}
	update() {
		this.vel.mult(1.5);
	}

	show() {
		push();
		noFill();stroke(this.color,255,255);
		translate(this.pos.x,this.pos.y);
		point(this.vel.x,this.vel.y);
		pop();
	}
}