class Particule {
	constructor(x,y,etat) {
		this.x = x;
		this.y = y;
		this.etat = false;
	}
	
	show() {
		noFill();
		strokeWeight(6);
		if( this.etat ) {
			stroke(255);
		} else {
			stroke(127);
		}
		point(this.x,this.y);
	}
	
	move() {
		this.x = this.x + random(-1,1);
		this.y = this.y + random(-1,1);
		
	}
}