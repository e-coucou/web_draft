let bateaux = [];
let nb = 1;
let targets = [];
let nbT = 100;
let cibles = [];

let aligneSlider, cohesionSlider, separationSlider;
let qt,boundary;
const RADIUS = 200;
const SEUIL=30;

let edgeY;
let p;

function setup() {
	createCanvas(1000,700);
	edgeY = floor(height*0.8);
	p = createP(); p.style('font-size','16');

	for (let i= 0; i<nb;i++) {
		let cible = floor(random(nbT));
		cibles.push(cible);
		let bateau = new Bateau(random(width),random(edgeY),random(2,5),cible);
		bateaux[i] = bateau;
	}
	for (let i= 0; i<nbT;i++) {
		let	target = new Target(random(width),random(edgeY),random(2,2.5));
		if (cibles.includes(i)) target.chasseur = 1;
		targets[i] = target;
	}
	boundary = new Rectangle(width/2,edgeY/2,width/2,edgeY/2);

	aligneSlider = createSlider(0,2,1,0.1);
	cohesionSlider = createSlider(0,2,1,0.1);
	separationSlider = createSlider(0,2,1,0.1);
}

function mousePressed() {
	let	target = new Target(mouseX,mouseY,random(1,4));
	targets.push(target);
	nbT = targets.length;
}

function draw() {
	background(71);
	//- dessin de la target
	stroke(255,0,0,255);
	noFill();
	strokeWeight(3);
	// target = createVector(mouseX, mouseY);
	// circle(target.x,target.y,10);
	//on definit le territoire
	//- un obstacle ..
	stroke(0,255,220,255);
	noFill();
	strokeWeight(5);
	circle(width/2,edgeY/2,2*RADIUS);
	line(0,edgeY+5,width,edgeY+5);
	// Bateaux
	for (let i= 0; i<nb;i++) {
		let bateau = bateaux[i];
//	bateau.addForce(bateau.seek(target.pos)); // vs flee pour eloigner le bateau
		if (bateau.cible === -1) {

		} else {
			bateau.addForce(bateau.pursue(targets[bateau.cible])); // vs evade pour eloigner le bateau
		}
		// bateau.wander();
		if (frameCount % 500 === 0) {
			let cible = bateau.cible;
			cibles = cibles.filter(d=>d!=cible);
			targets[cible].chasseur=-1;
			cible = floor(random(targets.length));
			targets[cible].chasseur=1;
			bateau.cible = cible;
		}
		bateau.update();
		bateau.edge();
		if (bateau.attrap()) {
			let cible = bateau.cible;
			cibles = cibles.filter(d=>d!=cible);
			let supp = targets.splice(cible,1);
			if(targets.length>0) {
				cible = floor(random(targets.length));
				targets[cible].chasseur=1;
				bateau.cible = cible;
			} else {
				bateau.cible = -1;
			}
		}
		bateau.show();
	}

	qt = new Quadtree(boundary,4);
	for (let i= 0; i<targets.length;i++) {
		let target = targets[i];
		let p = new Point(target.pos.x,target.pos.y,target); //console.log(p);
		qt.insert(p);
	}
	for (target of targets) {
		rectMode(CENTER);
		let range = new Rectangle(target.pos.x-20,target.pos.y-20,80,80);
		// strokeWeight(1),stroke(0,255,30);noFill();
		// rect(target.pos.x,target.pos.y,40,40);
		let points = qt.query(range);
//		console.log(points);
		// target.wander();
		target.flock(points);
		target.update();
		target.edge();
		target.show();
	}
	// qt.show();
	p.html(targets.length);
}