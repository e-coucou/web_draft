const eC = {version: 'r01'};

let gravity;
let wind;
let snow;

let file;
let pictures = [];

function preload() {
	file = loadImage('f32.png');
}
function windowsResized(){
	resizeCanvas(windowWidth,windowHeight);
}

function setup() {
	createCanvas(windowWidth,windowHeight);
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");

	gravity=0.005;
	snow = new Snow();

	for( let x=0;x<file.width;x+=32) {
		for (let y=0;y<file.height;y+=32) {
			let img = file.get(x,y,32,32);
			pictures.push(img);
		}
	}
}

function draw() {
	background(0,120);
	if(random()<0.7) snow.addF();

	snow.update();
	snow.show();
}
