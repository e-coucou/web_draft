const eC = {version: 'r01'};
let segments = [];

function windowsResized(){
	resizeCanvas(windowWidth,windowHeight);
}

function setup() {
	// createCanvas(windowWidth,windowHeight);
	createCanvas(800,800);
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
	let a = createVector(0,100);
	let b = createVector(600,100);
	let h = sqrt(3)/2 * p5.Vector.dist(a,b);
	let c = createVector(300,h+100);
	let s1 = new Segment(a,b);
	let s2 = new Segment(b,c);
	let s3 = new Segment(c,a);
	segments.push(s1);
	segments.push(s2);
	segments.push(s3);

}

function mousePressed() {
	let newSegments = [];
	for (s of segments) {
		let childs = s.generate();
		newSegments = newSegments.concat(childs);
	}

	segments = newSegments;
}

function draw() {
	background(0);
	translate(100,100);

	for (s of segments) {
		s.show();
	}
}



//--------
class Segment {
	constructor(s_,e_) {
		this.start = s_;
		this.end = e_;
	}

	generate() {
		let childs = [4];
		let v = this.end.copy();
		v.sub(this.start).div(3);
		//Seg 0
		let a1 = this.start.copy().add(v);
		childs[0] = new Segment(this.start,a1);

		//Seg 3
		let a3 = this.end.copy().sub(v);
		childs[3] = new Segment(a3,this.end);

		//Seg 1 & 2
		let a2 = a1.copy() .add(v.rotate(-PI/3));
		childs[1] = new Segment(a1,a2);
		childs[2] = new Segment(a2,a3);

		return childs;
	}

	show() {
		stroke(255); strokeWeight(1);
		line(this.start.x,this.start.y,this.end.x,this.end.y);
	}
}