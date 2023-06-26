let xOff = 0;
let yOff = 0;
let zOff = 0;
let inc = 0.2;

let scale = 20;
let cols, rows;
let flow;

let particles = [],
	nb = 1000;

function setup() {
	createCanvas(800, 600);
	cols = floor(width / scale);
	rows = floor(height / scale);
	background(200);
	// pixelDensity(1);
	noiseDetail(4, 0.5);
	for (let i = 0; i < nb; i++) {
		particles[i] = new Particule();
	}
	flow = new Array(cols * rows);
	background(255);
}

function draw() {
	// loadPixels();
	// yOff = 0;
	yOff = 0;
	for (let y = 0; y < rows; y++) {
		xOff = 0;
		for (let x = 0; x < cols; x++) {
			let index = (x + y * cols);
			let r = map(noise(xOff, yOff, zOff), 0, 1, 0, TWO_PI);
			let v = p5.Vector.fromAngle(r);
			flow[index] = v.setMag(0.5);
			// pixels[index+0] = r;
			// pixels[index+1] = r;
			// pixels[index+2] = r;
			// pixels[index+3] = 255;

			// fill(r);
			// rect(x*scale,y*scale,scale,scale);

			// push();
			// translate(x*scale,y*scale);
			// rotate(v.heading());
			// stroke(200);
			// strokeWeight(1);
			// line(0,0,scale,0);
			// pop();
			xOff += inc;
		}
		yOff += inc;
	}
	zOff += inc / 20.0;
	// updatePixels();

	for (let i = 0; i < particles.length; i++) {
		particles[i].flow(flow);
		particles[i].update();
		particles[i].show();
		particles[i].bords();
	}
	// noLoop();
}