let population;
let lifetime = 200;
let target;

function setup() {
	createCanvas(800,400);	
	population = new Population();
	target = createVector(width/2,50);
}

function draw() {
	background(51);
	population.run();
	fill(230,110,110);
	circle(target.x,target.y,8);
}

function Population() {
	this.rockets = [];
	this.nb = 25;

	for(let i=0;i<this.nb;i++) {
		this.rockets[i] = new Rocket();
	}

	this.run = function() {
		for(let i=0;i<this.nb;i++) {
			this.rockets[i].update();
			this.rockets[i].show();
		}
	}
}

function Rocket() {
	this.pos = createVector(width/2,height);
	this.vel = createVector();
	this.acc = createVector();
	this.dna = new DNA();
	this.count = 0;

	this.force = function(force) {
		this.acc.add(force);
		this.count = (this.count +1) % lifetime;
	}

	this.update = function() {
		this.force(this.dna.genes[this.count]);
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.mult(0);
	}

	this.show = function() {
		push();
		fill(255,127);
		translate(this.pos.x,this.pos.y);
		rotate(this.vel.heading());
		rectMode(CENTER);
		rect(0,0,20,5);
		pop();
	}
}

function DNA() {
	this.genes = [];

	for (let i=0; i<lifetime;i++) {
		this.genes[i] = p5.Vector.random2D();
		this.genes[i].setMag(0.1);
	}
}
