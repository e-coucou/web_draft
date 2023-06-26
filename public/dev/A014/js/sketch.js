const eC = {version: 'r01'};
let n = 0;
const c = 4;

function setup() {
	createCanvas(600,600);
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
	background(0);
	angleMode(DEGREES);
	colorMode(HSB);
}

function draw() {
	let a = n * 137.5;
	let r = c * sqrt(n);

	let x = r * cos(a) + width/2;
	let y = r * sin(a) + height/2;

	noStroke(); fill(r%255,255,100);
	circle(x,y,8);

	n++;
}
