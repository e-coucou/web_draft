const eC = {version: 'r01'};

let model;
let sketchPath = null;

let x, y, pen="down";

function windowResized(){
	resizeCanvas(windowWidth,windowHeight);
}

function preload() {
}

function setup() {
	// createCanvas(windowWidth,windowHeight);
	createCanvas(800,800);
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");

	model = ml5.sketchRNN('snowflake',modelReady);
	x=random(-width/2,width/2);
	y=random(-height/2,height/2);
	pen = "down";

	background(0);
	stroke(255);
}

function draw() {
	translate(width/2,height/2);
	if (sketchPath != null) {
		let nX = x+sketchPath.dx*0.08;
		let nY = y+sketchPath.dy*0.08;
		// stroke(255,0,0);
		strokeWeight(1);
		switch (pen) {
			case 'down' :
				line(x,y,nX,nY);
			case 'up' :
				pen = sketchPath.pen;
 				sketchPath = null;
				x=nX, y=nY;
				model.generate(gotSketch);
				break;
			case 'end':
				sketchPath = null;
				x=random(-width/2,width/2);
				y=random(-height/2,height/2);
				pen = "down";
				console.log('complete ... then new one!');
				model.reset();
				model.generate(gotSketch);
		}
	}
}


function modelReady() {
	console.log('Model reay ... then generate!');
	model.reset();
	model.generate(gotSketch);
}

function gotSketch(error,s) {
	if (error) {
		console.log('error generate model');
	} else {
		sketchPath = s;
		// console.log(sketchPath);
	}
}