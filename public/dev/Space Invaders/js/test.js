
let bg=[];
let pD;

function getID(x,y,i,j) {
	return (x*pD +i +(y* pD +j)*width*pD)*4;
}

function printPixel(x,y) {
	for (let i = 0; i<pD ; i++) {
		for (let j=0; j<pD ; j++) {
			for (let k =0; k<4 ; k++) {
				console.log(bg[getID(x,y,i,j)+k]);
			}
		}
	}
}
function colorPixel(x,y) {
	for (let i = 0; i<pD ; i++) {
		for (let j=0; j<pD ; j++) {
			let id = getID(x,y,i,j);
			bg[id] = 0;
			bg[id+1] = 255;
			bg[id+2] = 0;
			bg[id+3] = 255;
		}
	}
}

function copieBG() {
	for (let i=0;i<pixels.length;i++) {
		bg[i] = pixels[i];
	}
}
function copieP() {
	for (let i=0;i<pixels.length;i++) {
		pixels[i] = bg[i];
	}
}

function setup() {
	createCanvas(100,100);
	pD= (pixelDensity());
	background(0);
	// bg = pixels.slice();

	stroke(255,0,0);strokeWeight(1);
	for (let x=10;x<20;x++) {
		for (let y=10; y<20; y++) {
			point(x,y);
		}
	}

	loadPixels();

	copieBG();

	stroke(255,0,0);strokeWeight(1);
	for (let x=30;x<40;x++) {
		for (let y=30; y<40; y++) {
			colorPixel(x,y);
		}
	}

	copieP()
	updatePixels();
}

function draw() {

}