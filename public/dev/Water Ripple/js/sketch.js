let rows = 400, cols=400;
let current;
let previous;
let damping = 1.0;

function setup() {
	createCanvas(rows,cols);
	pixelDensity(1);
	current = new Array(cols).fill(0).map(n => new Array(rows).fill(0));
	previous = new Array(cols).fill(0).map(n => new Array(rows).fill(0));
}

function mouseDragged() {
	previous[mouseX][mouseY] = 500;
}

function draw() {
	// frameRate(10);
	background(0);
	loadPixels();
	for (let x=1;x<cols-1;x++) {
		for (let y=1;y<rows-1;y++) {
			current[x][y] = ( previous[x-1][y] + previous[x+1][y] + previous[x][y-1] + previous[x][y+1] )/2 - current[x][y];
			current[x][y] = current[x][y] * damping;

			let index = (x + y*cols)*4;
			pixels[index++] = current[x][y];
			pixels[index++] = current[x][y];
			pixels[index++] = current[x][y];
		}
	}
	updatePixels();
	let temp = previous;
	previous = current;
	current = temp;

}