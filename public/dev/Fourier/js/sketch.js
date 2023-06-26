let time = 0;
let r = 70;
let path = [];
let offset = 150;

let slider;

function setup() {
	createCanvas(600,400);
	slider = createSlider(1,100,1,1);
}

function draw() {
	background(51);
	translate(120,200);
	let x=0, y=0;

	for (let i=0; i<slider.value();i++) {
		let n = 2 * i + 1;
		let prevx = x;
		let prevy = y;
		let radius = r * (4/n/PI);
		x += radius  * cos(n*time);
		y += radius  * sin(n*time);
		noFill();stroke(255,100);
		circle(prevx,prevy,radius*2);
		stroke(255);
		line(prevx,prevy,x,y);
		// fill(255);
		// circle(x,y,4);
	}
	path.unshift(y);

	// draw path
	translate(offset,0);
	line(x-offset,y,0,y);
	beginShape();
	noFill();stroke(10,120,200);
	for ( let i = 0; i<path.length;i++) {
		vertex(i,path[i]);
 	}
	endShape();

	time+=0.03;
	if (path.length>(width-offset-120)) path.pop();
}