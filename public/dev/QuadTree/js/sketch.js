let qt;

function setup() {
	createCanvas(800, 800);
	let boundary = new Rectangle(400, 400, 400, 400);
	qt = new Quadtree(boundary, 4);
	for (let i = 0; i < 100; i++) {
		let p = new Point(random(width), random(height));
		qt.insert(p);
	}
	// console.log(qt);
}

function draw() {
	if (mouseIsPressed) {
		let m = new Point(mouseX, mouseY);
		qt.insert(m);
	}
	background(0);
	qt.show();

	stroke(0, 255, 0);
	rectMode(CENTER);
	let range = new Rectangle(mouseX, mouseY, 25, 25);
	// let range = new Rectangle(random(width),random(height),100,100); 
	rect(range.x, range.y, range.w * 2, range.h * 2);
	let points = qt.query(range);
	// console.log(points);
	for (let p of points) {
		strokeWeight(4);
		stroke(10, 200, 150);
		point(p.x, p.y);
	}
	// console.log(points)
	// noLoop();
}