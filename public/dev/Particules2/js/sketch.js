let particules = [];

function setup() {
	canvas = createCanvas(600,400);

	canvas.parent("canvas");
	let p = new Particule();
	particules.push(p);
}

function draw() {
	background(51);
	for (let x=0;x<15;x++) {
		particules.push(new Particule());
	}
	for(let i = particules.length-1;i>=0;i--) {
		particules[i].update();
		particules[i].show();
		if( particules[i].isFinished()) {
			particules.splice(i,1);
		}
	}
}

class Particule {

	constructor() {
		this.x = 300;
		this.y= 380;
		this.vx = random(-1,1);
		this.vy = random(-5,-1);
		this.alpha = 255;
	}

	isFinished() {
		return this.alpha <0;
	}
	update() {
		this.x += this.vx;
		this.y += this.vy;
		this.alpha -= 4;
	}

	show() {
		fill(255,this.alpha);
		noStroke();
		circle(this.x,this.y,8);
	}
}