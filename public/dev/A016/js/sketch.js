const eC = {version: 'r01'};
var socket;

function windowsResized(){
	resizeCanvas(windowWidth,windowHeight);
}

function setup() {
	// createCanvas(windowWidth,windowHeight);
	createCanvas(400,400);
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
	socket = io.connect('http://localhost:3000');
	// socket = io.connect('http://192.168.1.69:3000');
	socket.on('mouse',msgReceived);
	background(0);
}

function msgReceived(data) {
	fill(random(256),random(256),random(256)); noStroke();
	circle(data.x,data.y,10);
}

function mouseDragged() {
	fill(0,255,0); noStroke();
	circle(mouseX,mouseY,10);
	let data = { x: mouseX, y: mouseY };
	socket.emit('mouse',data) 
}

function draw() {
}