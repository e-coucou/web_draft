const eC = {version: 'r01'};

let fireworks = [];
let gravity;
let idG = 0;
let generations = [0.02,0.1,0.5,1];

function setup() {
	createCanvas(windowWidth,400);
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
	angleMode(DEGREES);

	stroke(255);
	strokeWeight(4);

	gravity=createVector(0,0.2);
}

function mousePressed() {
	idG = (idG + 1) % 4;
}

function draw() {
	colorMode(RGB);
	background(0,0,0,100);
	if (random()<generations[idG]) {
		fireworks.push(new Firework());
	}

	for (let i=fireworks.length-1;i>=0;i--) {
		let f = fireworks[i];
		f.update();
		f.show();
		if (f.done()) { fireworks.splice(i,1);} 
	}
}

//---------------------
class Firework {
	constructor() {
		this.hue = random(255);
		this.firework = new Particule(random(width),height,this.hue,true);
		this.explose = false;
		this.explosions= [];
	}

	done() {
		if (this.explose && this.explosions.length ===0) {
			return true;
		} else {
			return false;
		}
	}

	update() {
		if (!this.explose) {
			this.firework.applyForce(gravity);
			this.firework.update();

			if (this.firework.vel.y >=0) {
				this.explose = true;
				this.explosion();
			}
		} else {
			for (let i= this.explosions.length-1; i>=0;i--) {
				this.explosions[i].applyForce(gravity);
				this.explosions[i].update();
				if (this.explosions[i].done()) {
					this.explosions.splice(i,1);
				}
			}
		}
	}

	explosion() {
		for (let i = 0; i<100;i++) {
			this.explosions.push( new Particule(this.firework.pos.x,this.firework.pos.y,this.hue));
		}
	}

	show() {
		if (!this.explose) {
			this.firework.show();
		} else { 
			for (let e of this.explosions) {
				e.show();
			}
		}
	}
}


//---------------------
class Particule {
	constructor(x,y,hue,firework) {
		this.pos = createVector(x,y);
		this.firework = firework;
		this.lifespan = 255;
		this.hue = hue;
		if (this.firework) {
			this.vel = createVector(0,random(-12,-8));
		} else { 
			this.vel = p5.Vector.random2D();
			this.vel.setMag(random(1,3));
		}
		this.acc = createVector(0,0);
	}

	applyForce(force) {
		this.acc.add(force);
	}

	done() {
		if (this.lifespan <= 0) { return true; }
		else { return false;}
	}

	update() {
		this.vel.add(this.acc);
		if (!this.firework) {
			this.vel.mult(random(9,10)/10);
			this.lifespan -= 3;
		}
		this.pos.add(this.vel);
		this.acc.mult(0);
	}

	show() {
		colorMode(HSB);
		if (!this.firework) {
			stroke(this.hue,255,255,this.lifespan);
			strokeWeight(2);
		} else {
			stroke(255);
			strokeWeight(4);
		}
		point(this.pos.x,this.pos.y);
	}
}