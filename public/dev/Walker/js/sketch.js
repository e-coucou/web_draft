const eC = {version: 'r01'};

let tree=[];
let walker;
let r = 16;

function windowsResized(){
	resizeCanvas(windowWidth,windowHeight);
}

function setup() {
	createCanvas(windowWidth,windowHeight);
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
}

function draw() {
	background(0);
}