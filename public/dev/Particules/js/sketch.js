let total = 1000;
let particules = [];

function setup() {
	canvas = createCanvas(900,600);
	// for(let i = 0; i<500; i++) {
		// let p = new Point(random(width),random(height));
		// qt.insert(p);
	// }
	// console.log(qt);

	canvas.parent("canvas");
	
	for( let i=0;i<total;i++) {
		particules[i] = new Particule(random(width),random(height));
	}
}

function draw() {
	// if( mouseIsPressed) {
		// let m = new Point(mouseX,mouseY);
		// qt.insert(m);
	// }
	background(0);
	let boundary = new Rectangle(width/2,height/2,width/2,height/2);
	let qt = new Quadtree(boundary,4);
	for (let i= 0; i<total;i++) {
		let p = new Point(particules[i].x,particules[i].y,particules[i]);
		qt.insert(p);
		particules[i].show();
		particules[i].move();
	}
	
	for (let p of particules){
		let range = new Rectangle(p.x,p.y,3,3); 
//		rect(range.x,range.y,range.w*2,range.h*2);
		p.etat=false;
		let points = [];
		points = qt.query(range);
		if (points.length > 1) {// particules[i].etat = true;
			for (let it of points) {
				it.parent.etat=true;
				// p.show();
			}
		}
	}
	// qt.show();

	// stroke(0,255,0);
	// rectMode(CENTER);
	// let range = new Rectangle(mouseX,mouseY,25,25);
	// // let range = new Rectangle(random(width),random(height),100,100); 
	// rect(range.x,range.y,range.w*2,range.h*2);
	// let points = qt.query(range);
	// console.log(points);
	// for (let p of points) {
		// strokeWeight(4);
		// stroke(10,200,150);
		// point(p.x,p.y);
	// }
	// noLoop();
}