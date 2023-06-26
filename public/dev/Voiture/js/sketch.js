const eC = {version: 'r01'};

let voiture;
let img;

function preload() {
	imgAV = loadImage('vn_av.jpg');
	imgAR = loadImage('vn_ar.jpg');
	imgCT = loadImage('vn_ct.jpg');
}

function windowsResized(){
	resizeCanvas(windowWidth,windowHeight);
}

function setup() {
	createCanvas(windowWidth,windowHeight);
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
	voiture = new Voiture();
}

function keyPressed() {
	if (keyCode === UP_ARROW) {
		voiture.applyForce(createVector(0,-1));
	} else if (keyCode === DOWN_ARROW) {
		voiture.applyForce(createVector(0,1));
	} else if (keyCode === LEFT_ARROW) {
		voiture.applyForce(createVector(-1,0));
	} else if (keyCode === RIGHT_ARROW) {
		voiture.applyForce(createVector(1,0));
	}
	voiture.update();
}

function draw() {
	background(255);
	voiture.edges();
	voiture.update();
	voiture.affiche();
}


//-------------
class Voiture {
	constructor() {
		this.pos = createVector(random(width),random(height));
		this.vit = createVector(0,0);
		this.acc = createVector(0,0);
		this.sizeX = 120;
		this.sizeY = 60;
	}

	update() {
		this.vit.add(this.acc);
		this.pos.add(this.vit);
		this.acc.mult(0);
	}

	applyForce(force) {
		this.acc.add(force);
	}

	edges() {
		if( this.pos.x > width-this.sizeX || this.pos.x <0) { this.vit.x *= -1;}
		if( this.pos.y > height-this.sizeY/2 || this.pos.y <this.sizeY/2) { this.vit.y *= -1;}
	}

	affiche() {
		push();
		translate(this.pos.x,this.pos.y-this.sizeY/2);
		if(this.vit.x>0) {
			scale(-1,1);
			translate(-this.sizeX,0);
			image(imgCT,0,0,this.sizeX,this.sizeY);
		} else {
			image(imgCT,0,0,this.sizeX,this.sizeY);
		}
		if (this.vit.y>0) {
			image(imgAV,0,0,this.sizeX,this.sizeY);
		} else {
			image(imgAR,0,0,this.sizeX,this.sizeY);
		}
		pop();
	}
}
