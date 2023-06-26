let w = 400;
let h = 300;
let buffer1,buffer2, cooling;
let yStart = 0;

function init_fire(n) {
	buffer1.loadPixels();
	for(let i= 0;i<w;i++) {
		for(let j=1;j<=n;j++) {
			let index = (i + (h-j)*w)*4; 
			buffer1.pixels[index++] = 255;
			buffer1.pixels[index++] = 0;
			buffer1.pixels[index++] = 0;
			buffer1.pixels[index] = 255;
		}
	}
	buffer1.updatePixels();
}
function setup() {
	pixelDensity(1);
	createCanvas(w*2,h);
	buffer1 = createGraphics(w,h);
	buffer2 = createGraphics(w,h);
	cooling = createImage(w,h);

}

function cool() {
	cooling.loadPixels();
	let xOff = 0.0;
	let xInc =0.02;
	for(let x=0; x<w ;x++) {
		xOff += xInc;
		let yOff = yStart;
		for(let y=0;y<h;y++) {
			yOff += xInc;
			let n = noise(xOff,yOff);
			let bright = pow(n,3) *255;
			let index = (x + y*w) * 4;
			cooling.pixels[index++] = bright;
			cooling.pixels[index++] = bright;
			cooling.pixels[index++] = bright;
			cooling.pixels[index] = 255;
		}
	}
	cooling.updatePixels();
	yStart += xInc;
}

function draw() {
	init_fire(5);
	cool();
	background(0);
	buffer1.loadPixels();
	buffer2.loadPixels();
	// algo
	for(let x=1; x<w-1;x++) {
		for(let y=1; y<h-1;y++) {
			//index des points adjacents
			let id0 = ((x+0) + (y+0)*w) *4;
			let id1 = ((x+1) + (y+0)*w) *4;
			let id2 = ((x-1) + (y+0)*w) *4;
			let id3 = ((x+0) + (y+1)*w) *4;
			let id4 = ((x+0) + (y-1)*w) *4;
			// get colors in B1
			let c0 = cooling.pixels[id0];
			let c1 = buffer1.pixels[id1];
			let c2 = buffer1.pixels[id2];
			let c3 = buffer1.pixels[id3];
			let c4 = buffer1.pixels[id4];
			let c = (c1+c2+c3+c4)/4 - c0;
			//change color in B2 de id4 (le point au dessus )
			buffer2.pixels[id4++] = c;
			buffer2.pixels[id4++] = 0;
			buffer2.pixels[id4++] = 0;
			buffer2.pixels[id4] = 255;
		}
		buffer2.updatePixels();
	}


	//Swap Buffer
	let temp = buffer1;
	buffer1 = buffer2;
	buffer2 = temp;
	//affiche
	image(buffer2,0,0);
	image(cooling,w,0);
}