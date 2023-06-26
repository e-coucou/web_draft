let ord = 7;
let N = Math.pow(2,ord);
let total = N*N;
let path =[];
let counter = 0;
let size = 512;

function setup() {
	createCanvas(size,size);
	background(0);
	for(let i = 0; i<total;i++) {
		path[i] = hilbert(i);
		let len = width / N;
		path[i].mult(len);
		path[i].add(len/2,len/2);
	}
	colorMode(HSB,360,255,255);
}

let index = 0;
function draw() {
	background(51);
	// stroke(255);
	strokeWeight(1);
	noFill();
	beginShape();

	for (let i=1; i<counter;i++) {
		let coul = map(i,0,path.length,0,360);
		stroke(coul,255,255);
		line(path[i-1].x, path[i-1].y,path[i].x, path[i].y);
		// vertex(path[i].x, path[i].y);
	}
	endShape();
	// for (let i=0; i<path.length;i++) {
	// 	strokeWeight(6);
	// 	point(path[i].x, path[i].y);
	// 	strokeWeight(1);
	// 	text(i,path[i].x+7,path[i].y-3);
	// }
	counter+=127;
	if (counter> path.length) counter=0;
}

function hilbert(i) {
	const points = [
		new p5.Vector(0,0),
		new p5.Vector(0,1),
		new p5.Vector(1,1),
		new p5.Vector(1,0)];

	let id = i & 3;
	let v = points[id];
	
	for( let j =1; j<ord;j++) {
		i = i>>>2;
		id = i & 3;
		let len = Math.pow(2,j);
		let tmp;
		switch(id) {
		case 0:
			tmp = v.x;
			v.x = v.y;
			v.y = tmp;
			break;
		case 1:
			v.y+= len;
			break;
		case 2:
			v.x+= len; v.y+=len;
			break;
		case 3:
			// v.x+=len;
			tmp = v.x;
			v.x = -1-v.y+2*len;
			v.y = len-1-tmp;
			break;
		}
	}
	return v;
}