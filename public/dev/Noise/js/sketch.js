const noiseMax = 4;

function setup() {
	createCanvas(600,600);


}

function draw() {
	draw_();
}


function draw_() {
	background(0);
	translate(width/2,height/2);
	noFill();
	stroke(255);
	beginShape();
	for (let a = 0; a< TWO_PI ; a+=0.05) {
		let xOff = map(cos(a),-1,1,0,noiseMax);
		let yOff = map(sin(a),-1,1,0,noiseMax);
		let r = map(noise(xOff,yOff),0,1,100,200);
		let x = cos(a) * r;
		let y = sin(a) * r;
		vertex(x,y);
	}
	endShape(CLOSE);
	noLoop();
}