let n1=0.3;
let n2=0.3;
let n3=0.3;
let m;
let a = 1;
let b= 1;
const scale = 100;
const total = 500;
let inc, osc=0;

let slider;

function setup() {
	createCanvas(400,400);
	inc = TWO_PI / total;
	slider = createSlider(0,20,2,1);
}

function superShape(alpha) {
	let t= m/4*alpha;
	let a1 = Math.pow(abs(1/a * cos(t)),n2)
	let a2 = Math.pow(abs(1/b * sin(t)),n3)
	let r =  Math.pow(a1+a2,1/n1)
	return 1/r;
}

function draw() {
	frameRate(10);
	background(51);
	translate(width/2,height/2);
	stroke(255);
	noFill();

	m =  map(sin(osc),-1,1,0,20);//slider.value();
	osc += 0.1;

	beginShape();
	for (let a=0;a<TWO_PI;a += inc) {
		let r = superShape(a);
		let x = scale * r * cos(a);
		let y = scale * r * sin(a);
		vertex(x,y);
	}
	endShape(CLOSE);
}
