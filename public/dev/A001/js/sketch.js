let result;
let t, c;
let mn;
let checkB, startB;
let easeB, easy = true;
let liste;

// function ease(p) {
//   return 3*p*p - 2*p*p*p;
// }

function ease(p, g) {
	if (p < 0.5)
		return 0.5 * pow(2 * p, g);
	else
		return 1 - 0.5 * pow(2 * (1 - p), g);
}


// function push() {
//   pushMatrix();
//   pushStyle();
// }

// function pop() {
//   popStyle();
//   popMatrix();
// }

function draw() {

	if (!recording) {
		t = mouseX * 1.0 / width;
		c = mouseY * 1.0 / height;
		if (mouseIsPressed)
			// println(c);
			draw_();
	} else {
		for (let i = 0; i < result.length; i++)
			result[i] = 0;

		c = 0;
		for (let sa = 0; sa < samplesPerFrame; sa++) {
			t = map(frameCpt - 1 + sa * shutterAngle / samplesPerFrame, 0, numFrames, 0, 1);
			draw_();
			buffer.loadPixels();
			for (let i = 0; i < buffer.pixels.length; i++) {
				// let id = i*3;
				result[i] += buffer.pixels[i] >> 16 & 0xff;
				result[i] += buffer.pixels[i] >> 8 & 0xff;
				result[i] += buffer.pixels[i] & 0xff;
			}
		}

		buffer.loadPixels();
		for (let i = 0; i < buffer.pixels.length; i++) {
			// let id = i *3;
			buffer.pixels[i] = 0xff << 24 |
				(result[i] * 1.0 / samplesPerFrame) << 16 |
				(result[i] * 1.0 / samplesPerFrame) << 8 |
				(result[i] * 1.0 / samplesPerFrame);
		}
		buffer.updatePixels();

		// saveFrame("fr###.png");
		// println(frameCount,"/",numFrames);
		frameCpt++;
		if (frameCpt == numFrames) {
			console.log('exit');
			noLoop();
		}
	}
	image(buffer, 0, 0);
}
//
//----------------------------------------------------------------
let samplesPerFrame = 5;
let numFrames = 60;
let shutterAngle = 1.5;
let frameCpt = 0;

let recording = true;
let objets = [];
let nbO = 1000;
let choix = 'Point';

function reStart() {
	t = 0;
	frameCpt = 0;
	loop();
}

function checkBChange() {
	recording = this.checked;
}

function easeBChange() {
	easy = this.checked();
}

function newSel() {
	choix = liste.value();
	initObjet();
}

function initObjet() {
	objets = [];
	switch (choix) {
		case 'Point':
			objets.push(new Point);
			break;
		case 'Particules':
			nbO = 1000;
			for (let i = 0; i < nbO; i++) {
				let obj = new Particule();
				objets.push(obj);
			}
			break;
		case 'Cercle':
			nbO = 100;
			for (let i = 0; i < nbO; i++) {
				let a = i / nbO * TWO_PI;
				let obj = new Cercle(a);
				objets.push(obj);
			}
			break;
	}
}

function setup() {
	pixelDensity(1);
	createCanvas(500, 500);
	buffer = createGraphics(width, height);
	result = createGraphics(width, height);
	initObjet();

	mn = 0.5 * Math.sqrt(3), ia = atan(Math.sqrt(.5));

	checkB = createCheckbox('Recording', recording);
	checkB.changed(checkBChange);

	easeB = createCheckbox('Easy Fct', recording);
	easeB.changed(easeBChange);

	startB = createButton('Re-Start');
	startB.mousePressed(reStart);

	liste = createSelect();
	liste.option('Point');
	liste.option('Particules');
	liste.option('Cercle');
	liste.changed(newSel);
}

function draw_() {
	background(0);

	//  point(250+50*cos(TWO_PI*t),250+50*sin(TWO_PI*t));

	for (let i = 0; i < objets.length; i++) {
		objets[i].show();
	}
}

//---------------------
class Point {
	constructor() {

	}

	show() {
		stroke(255);
		strokeWeight(10);
		let t2 = easy ? ease(t, 3.0) : t;
		point(250 + 50 * cos(TWO_PI * t2), 250 + 50 * sin(TWO_PI * t2));
	}
}
//----------------------
class Particule {
	constructor() {
		this.x = random(100, width - 100);
		this.y = random(100, height - 100);
		this.r = random(3, 20);
		this.s = random(1, 2.5);
		this.o = 9 * noise(0.02 * this.x, 0.02 * this.y); //random(0,TWO_PI);
	}

	show() {
		stroke(255, 200);
		strokeWeight(this.s);
		let t2 = easy ? ease(t, 3.0) : t;
		point(this.x + this.r * cos(t2 * TWO_PI + this.o), this.y + this.r * sin(t2 * TWO_PI + this.o));
	}
}
//---------------------
class Cercle {
	constructor(angle) {
		this.o = random(0, 0.6);
		this.s = random(1, 5);
		this.theta = angle;

	}

	show() {
		stroke(255, 200);
		strokeWeight(this.s);
		let t2 = easy ? ease(t, 3.0) : t;
		this.r = width / 4 + width / 8 * sin(TWO_PI * t2 + this.o);
		let x = width / 2 + this.r * cos(this.theta);
		let y = height / 2 + this.r * sin(this.theta);
		point(x, y);
	}
}