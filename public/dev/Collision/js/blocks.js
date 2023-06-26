class Block {
	constructor(x,w,v,m=1,xC) {
		this.dec = 0;
		this.x = x;
		this.y = height-w;
		this.w = w;
		this.v = v;
		this.m = m;
		this.xC = xC-0.001;
	}

	mur() {
		return (this.x<=0);
	}

	retour() {
		this.v *= -1;
	}

	bing(other) {
		let masses = this.m + other.m;
		let nV = (this.m - other.m)*this.v + 2*other.m*other.v;
		return (nV/masses);
	}

	collision(other) {
		return !(this.x+this.w < other.x || this.x>other.x+other.w);
	}
	update() {
		// let nX = this.x + this.v;
		// const x = constrain(nX,this.xC,width);
		this.x += this.v;
	}
	show() {
		fill(100,100,155);
		const x = constrain(this.x,this.xC,width);
		rect(x+this.dec,this.y,this.w,this.w,3);
	}
}