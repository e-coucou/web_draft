// const w = 60;
// const h = w/4;

let compteur;
let decompte=10;
let nbMilli=0;
let run = false;
let canvas;
let btn= [];
let btn_txt = ['10"',"1'","3'","5'","10'","15'","30'"];
let btn_value = [10,60,180,300,600,900,1800];
let btnSt;

function windowResized() {
	canvas = createCanvas(innerWidth,innerHeight);
	let h = Math.min(width/7,height/7);
	compteur.resize(width/2,height/2,h,3);
}

function setup() {
	canvas = createCanvas(innerWidth,innerHeight);
	let h = Math.min(width/7,height/7);
	compteur = new Afficheur(width/2,height/2,h,3);
	for (let n=0;n<btn_txt.length;n++) {
		btn.push( new Bouton(width/8*(n+1),height-100,width/10,80,btn_txt[n], btn_value[n]) );
	}
	btn[0].select=true;
	btnSt = new Bouton(width/2,100,width/2,80,"Start/Stop", 1) ;
}

function keyPressed() {
	if (key=='r' | key=='R') restart();
	if (key=='s' | key=='s') run = !run;
	if (key=='0') restart(10);
	if (key=='1') restart(60);
	if (key=='3') restart(180);
	if (key=='5') restart(300);
	if (key=='A' | key=='a') restart(600);
	if (key=='B' | key=='b') restart(900);
	if (key=='C' | key=='a') restart(1800);
}

function restart(t=decompte) {
	decompte=t;
	nbMilli=0;
	run = true;
	btnSt.select = run;
}

function mousePressed() {
	if (mouseY>height/2) {
		for (let bt of btn) {
			if (bt.click(mouseX, mouseY)) {
				restart(bt.value); }
		}
	} else {
		if (btnSt.click(mouseX, mouseY)) {
			run = !run;
			btnSt.select = run;
		}
	}
}

function draw() {
	background(0);
	if (run) {
		nbMilli += deltaTime;
	}
	let num = int(nbMilli/1000);

	num = Math.max(0,decompte-num);
	let on=true;
	if (num==0) on=false;
	
	compteur.affiche(num,on,run);
	for (let bt of btn) {
		bt.show();
	}
	btnSt.show();
}

//---------------------------------------------------------
class Afficheur {
	constructor(x,y,w,n) {
		this.resize(x,y,w,n);
		this.couleur="#63DAC5";
		this.bk_couleur="#00180A";
	}

	resize(x,y,w,n){
		this.w = w;
		this.h = w/4;
		this.n=n;
		this.x=x;
		this.y=y;
	}

	segment(x,y,orient,etat) {
		push();
		translate(x,y);
		rectMode(CENTER);
		noStroke();
		fill(etat?this.couleur:this.bk_couleur);
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
	affiche(num,on=true,run=true) {
		if (on) {
			if(run) {
				this.couleur = "#63DAC5";
				this.bk_couleur = "#00180A";
			} else {
				this.couleur = "#3700B3";
				this.bk_couleur = "#070020";
			}
		} else {
			this.bk = "#300000";
			if ((int(frameCount/10))%2 == 0) {
				this.couleur=this.bk_couleur;
			} else {
				this.couleur = "#b00020";
			}
		}
		const itX = floor(this.w+3*this.h);
		const decX =floor(this.n*itX)/2; //+this.n*2;
		const decY = floor((this.w * 2 + this.h *3)/2) +1;
		for (let i=0;i<this.n;i++) {
			const p=pow(10,i);
			this.show(floor((num/p)%10),-decX+itX*(this.n-i-1),-decY);
		}
	}
}


class Bouton {
	constructor(x,y,w,h,txt,value) {
		this.x=x;
		this.y=y;
		this.w=w;
		this.h=h;
		this.txt=txt;
		this.value = value;
		this.select=false;
	}

	choix(c) {
		this.select=c;
	}
	click(x,y) {
		let on = (x<(this.x+this.w/2) & x>(this.x-this.w/2) & y<(this.y+this.h/2) & y>(this.y-this.h/2));
		this.choix(on);
		return on;
 	}

	show() {
		rectMode(CENTER);
		if (this.select) {
			fill('#63DAC5');
		} else {
			fill('#3700B3');
		}
		rect(this.x,this.y,this.w,this.h,10);
		textSize(this.h/2);
		textAlign(CENTER,CENTER);
		fill(255);
		text(this.txt,this.x,this.y)
	}
}