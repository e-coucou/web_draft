//---------------------------------------------------------
class Afficheur {
	constructor(x,y,w,n) {
		this.w = w;
		this.h = w/3;
		this.n=n;
		this.x=x;
		this.y=y;
	}

	segment(x,y,orient,etat) {
		push();
		translate(x,y);
		rectMode(CENTER);
		noStroke();
		fill(etat?"#FF1010":"#300000");
		if (orient) rotate(HALF_PI);
		beginShape();
		vertex(this.w/2,-this.h/2); //HD
		vertex(this.w/2+this.h/2,0);
		vertex(this.w/2,this.h/2); //BD
		vertex(-this.w/2,this.h/2); //BG
		vertex(-this.w/2-this.h/2,0);
		vertex(-this.w/2,-this.h/2); //HG
		// rect(0,0,w,h);
		endShape(CLOSE);
		pop();
	}

	show(val,decX,decY) {
		const convert = [0x3F, 0x06, 0x5b, 0x4f, 0x66, 0x6d, 0x7d, 0x07, 0x7f, 0x6f];
		const pos = [ 0x10, 0x21, 0x23, 0x14, 0x03, 0x01, 0x12];
		const orign = 0x36; // 0110110 = 36
		for (let i=0;i<7;i++) {
			const orient = (orign >> i) & 0x01;
			const etat = (convert[val] >> i) & 0x01;
			const x = (pos[i]>>4) * (this.w/2+this.h/2+2) +this.x +decX;
			const y = (pos[i]&0x0F) * (this.w/2+this.h/2+2) + this.y +decY;
			this.segment(x,y,orient,etat);
		}
	}
	affiche(num) {
		const itX = floor(this.w+3*this.h)+3;
		const decX =floor(this.n*itX)/2; //+this.n*2;
		const decY = floor((this.w * 2 + this.h *3)/2) +1;
		for (let i=0;i<this.n;i++) {
			const p=pow(10,i);
			this.show(floor((num/p)%10),-decX+itX*(this.n-i-1),-decY);
		}
	}
}