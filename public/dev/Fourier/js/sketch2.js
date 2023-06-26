const USER = 0;
const FOURIER = 1;
let state;

let time = 0;
let r = 25;
let path = [];
let offset = 150;

let xO=[];
let xFFT;

function setup() {
	createCanvas(800,600);
	state = FOURIER;
	let skip = 10; xO=[] ;
	for (let i =0; i<drawing.length;i+=skip) {
		let c = new Complex(drawing[i].x, drawing[i].y);
		xO.push(c);
		// let angle = map(i,0,100,0,TWO_PI);
		// yO.push(100*sin(angle));
		// yO.push(random(-100,100));
		// yO.push(100*noise(angle));
		// angle+=TWO_PI/100 ;
		// xO.push(100*cos(angle));
	}
	xFFT = dft(xO);

}

function mousePressed() {
	state = USER;
	drawing = [];
	time = 0;
	path = []; xO = [];
}

function mouseReleased() {
	state = FOURIER;
	let skip = 1;
	for (let i =0; i<drawing.length;i+=skip) {
		xO.push(new Complex(drawing[i].x,drawing[i].y));
	}
	xFFT = dft(xO);
	xFFT.sort((a,b)=> b.amp - a.amp);
}

function epiCycles(x,y,rotation,FFT) {
	for (let i=0; i<FFT.length;i++) {
		let n = FFT[i].freq;
		let prevx = x;
		let prevy = y;
		let radius = FFT[i].amp;
		let phase = FFT[i].phase;
		x += radius  * cos(n*time+phase + rotation);
		y += radius  * sin(n*time+phase + rotation);
		noFill();stroke(255,50);
		circle(prevx,prevy,radius*2);
		stroke(255,100);
		line(prevx,prevy,x,y);
	}
	return createVector(x,y);
}
function draw() {
	background(51);
	strokeWeight(1);
	// translate(120,200);
	if (state == USER) {
		let point = createVector(mouseX-width/2,mouseY-height/2);
		drawing.push(point);
		noFill(); stroke(255);
		beginShape();
		for(let v of drawing) {
			vertex(v.x+width/2,v.y+height/2);
		}
		endShape();
	} else if (state == FOURIER) {
		let v = epiCycles(width/2,height/2,0,xFFT);

		path.unshift(v);

		beginShape();
		noFill();stroke(10,120,200);strokeWeight(3);
		for ( let i = 0; i<path.length;i++) {
			vertex(path[i].x,path[i].y);
		}
		endShape();

		let dt = TWO_PI / xFFT.length;
		time+=dt;
		if (time>TWO_PI) {
			time=0;
			path=[];
		}
	}
	// if (path.length>(width-offset-120)) path.pop();
}