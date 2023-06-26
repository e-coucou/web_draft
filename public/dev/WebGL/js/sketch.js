let angle = 0;
let cam;

function setup() {
	createCanvas(600,600,WEBGL);

	cam = createCapture(VIDEO);
	cam.size(320,240);
	cam.hide();
}


function draw() {
	background(220);
	ambientLight(200,200,200);

	noStroke();
	texture(cam);

	push();
	rotateX(angle);
	rotateY(angle*1.1);
	rotateZ(angle*1.3);
	box(200);
	pop();

	translate(0,200,-100);
	rotateX(HALF_PI);
	plane(400,400);

	angle += 0.001;
}