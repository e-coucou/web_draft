
function settings() {

}
function setup() {
	createCanvas(N*SCALE,N*SCALE);
	fluid = new Fluid(0.1,0.0,0.0);
}

function mouseDragged() {
	let i = round(mouseX/SCALE)-1;
	let j = round(mouseY/SCALE)-1;
	fluid.addDensity( i, j, 200.0);
	let amountX = mouseX - pmouseX;
	let amountY = mouseY - pmouseY;
	fluid.addVelocity( i, j, amountX, amountY);
}

function cigarette() {
	fluid.addDensity(2,height/2,200.0);
	fluid.addVelocity(2,height/2,100.0,0);
}

function draw() {
	background(0);
	fluid.addDensity(2,height/2/SCALE,random(200,400));
	fluid.addVelocity(2,height/2/SCALE,1.5,-0.2);
	fluid.step();
	fluid.renderD();
}