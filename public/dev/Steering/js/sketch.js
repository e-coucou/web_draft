let birds = [], nbBirds = 5;
let foods = [], nbFoods=50;
let poisons = [], nbPoisons=10;
let debug;

function setup() {
	createCanvas(1000,600);
	for (let i=0;i<nbBirds;i++) {
		birds[i] = new Bird(floor(random(width)),floor(random(height)));
	}
	for (let i =0;i<nbFoods;i++) {
		foods[i] = createVector(floor(random(width)),floor(random(height)));
	}
	for (let i =0;i<nbPoisons;i++) {
		poisons[i] = createVector(floor(random(width)),floor(random(height)));
	}
	debug = createCheckbox();
}

function draw() {
	background(51);
	// frameRate(10);


	let target = createVector(mouseX,mouseY);
	fill(127);
	stroke(200);
	circle(target.x,target.y,10);

	//------
	// display foods ... in green
	for (let i =0;i<foods.length;i++) {
		fill(0,255,0); // R G B
		noStroke();
		circle(foods[i].x,foods[i].y,5);
	}
	for (let i =0;i<poisons.length;i++) {
		fill(255,0,0); // R G B
		noStroke();
		circle(poisons[i].x,poisons[i].y,5);
	}
	// add  food
	if (random(1)<0.02) {
		foods.push(createVector(floor(random(width)),floor(random(height))));
	}
	// add poison
	if (random(1)<0.01) {
		poisons.push(createVector(floor(random(width)),floor(random(height))));
	}
	//------
	// birds seek for foods !
	for (let i=birds.length-1;i>=0;i--) {
//		birds[i].seek(target);
		birds[i].edge();
		birds[i].behavior(foods,poisons);
		// birds[i].eat( foods);
		// birds[i].eat(poisons);
		birds[i].update();
		birds[i].show();

		let newBird = null;
		newBird = birds[i].clone();
		if (newBird !== null) {
			birds.push(newBird);
		}
		if (birds[i].dead()) {
			birds.splice(i,1);
		}
	}
}