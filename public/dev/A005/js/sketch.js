const z = 50;
const w = 1600;
const h = 600;
let scale = 11;
let rows, cols;
let relief = [];
let fly = 0, incFly = 0.05;

let from, to;

let avion;
let dec = 0, inc=0;

function setup() {
	createCanvas(800,500,WEBGL);
	rows = h / scale;
	cols = w / scale;
	colorMode(RGB);
	from = color(15,20,35,100);
	to = color(255,255,255,255);

	avion = new Plane(w/2,h,130);

}
function keyPressed() {
	if (keyCode === LEFT_ARROW) {
		inc = -0.05;
	} else if (keyCode === RIGHT_ARROW) {
		inc = 0.05;
	} else if (key === 'a') {
		incFly += 0.01;
	} else if (key === 'q') {
		incFly -= 0.01;
	}
}

function keyReleased() {
	inc = 0;
}
function draw() {
	background(0);
	pointLight(150,200,10,mouseX-width/2,mouseY-height/2,0);

	dec += inc;
	let yOff = -fly;
	for (let y=0;y<rows;y++) {
		let xOff = dec;
		relief[y] = [];
		for (let x=0;x<cols;x++) {
			let p = map(noise(xOff,yOff), 0,1, -z,z);
			relief[y][x] = p;
			xOff += 0.2;
		}
		yOff += 0.2;
	}
	stroke(255);
	push();
	rotateX(PI/3);
	translate(-w/2,-h/2);
	for (let j = 0; j<rows-1; j++) {
		beginShape(TRIANGLE_STRIP);
		for( let i = 0; i< cols; i++) {
			let p1 = relief[j][i];
			let p2 = relief[j+1][i];
			let val = map((p1+p2)/2,-z,z,0,1);
			let color = lerpColor(from,to,val);
			fill(color); noStroke();
			vertex(i*scale,j*scale,p1);
			vertex(i*scale,(j+1)*scale,p2);
		}
		endShape();
	}
	pop();

	avion.show();
	fly += incFly;
}


//-----------------------------------------------------------------
class Plane {
	constructor(x,y,z) {
		this.pos = createVector(x,y,z);
	}

	show() {
		fill(255);
		push();
		rotateX(PI/3);
		translate(-w/2,-h/2);
		translate(this.pos.x,this.pos.y,this.pos.z);
		rotateX(4*PI/9); // rotateY(-PI/2);
		rotateZ(-inc*PI);
		specularMaterial(200,100,30);
		// ambientMaterial(200,100,30);
		cone(3,7);
		// sphere(this.pos.x,this.pos.y,this.pos.z,10);
		pop();
	}
}