const eC = {version: 'r01'};
const link = 'https://www.cs.ubc.ca/~rbridson/docs/bridson-siggraph07-poissondisk.pdf';

let grid = [];
let active = [];
let classee = [];

const r = 2; // distance entee les points
const k = 30; // point avant rejection
let n=2;
let cols, rows;
let w;
let p0;
let crit;

function windowsResized(){
	resizeCanvas(windowWidth,windowHeight);
}

function id(x,y) {
	return (x + y*cols);
}

function critF(a) {
	a = a.sub(p0).heading() - PI/2;
	let x =  100*cos(a) * (1 + cos(a)) + p0.x;
	let y =  100*sin(a) * (1 + cos(a)) + p0.y;
	let v = createVector(x,y);
	// let v = p5.Vector.fromAngle(a).setMag(crit).add(p0);
	let d = p5.Vector.dist(v,p0);
	// console.log(d,v); 
	return d;
}

function setup() {
	// createCanvas(windowWidth,windowHeight);
	createCanvas(600,600);
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
	colorMode(HSB);
	crit = width/6;
	// STEP 0
	w = r / sqrt(n);
	rows = floor(width/w);
	cols = floor(height/w);
	for (let i = 0;i<cols*rows; i++) {
		grid[i] = undefined;
	}
	// STEP 1
	// let x = floor(random(width));
	// let y = floor(random(height));
	let x = floor(width/2);
	let y = floor(height/2);
	p0 = createVector(x,y);
	// let pos = createVector(x,y);
	grid[id(x/w,y/w)]=p0;
	active.push(p0);
	classee.push(p0);
	// frameRate(1);
}

function draw() {
	background(0);
	for(let a=0;a<100;a++){
	  if(active.length >0) {
		let randId = floor(random(active.length));
		let pos = active[randId];
		found=false;
		for (let l=0; l<k;l++) {
			let sample = p5.Vector.random2D();
			let mag = random(r,2*r);
			sample.setMag(mag);
			sample.add(pos);
			let col = floor(sample.x / w);
			let row = floor(sample.y / w);
			let v = createVector(sample.x,sample.y);
			let ok = true;
			let ref = critF(v.copy());
			let e = p5.Vector.dist(p0,v);
			// let ee = p5.Vector.dist(p0.copy().div(w),v.div(w));
			// if (col>-1 && col<cols && row>-1 && row<rows && !grid[id(col,row)]) {
			if (e<(ref) && !grid[id(col,row)]) {
				for (let i=-1;i<=1;i++) {
					for (let j=-1;j<=1;j++) {
						let idx = id(i+col , (j+row));
						let voisin = grid[idx];
						if (voisin) {
							let d = p5.Vector.dist(sample,voisin);
							if (d<r) { ok = false;}
						}
					}
				}
				if (ok) {
					found = true;
					grid[id(col,row)] = sample;
					classee.push(sample);
					active.push(sample);
					break;
				}
			}
		}
		// console.log(frameCount);
		if (!found) {
			active.splice(randId,1);
		}
	  } else noLoop();
	}

	//--
	// Affichage
	strokeWeight(sqrt(r));
	for(let i=0;i<classee.length;i++) {
		let p = classee[i];
		if (p) {
			stroke(p.x%360,255,255);
			point(p.x,p.y);
		}
	}
	for(let p of active) {
		stroke(255);
		point(p.x,p.y);
	}
}