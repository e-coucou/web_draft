//---------------
// SPACE INVADERS --
const eC = {version: 'r00'};

let lignes = [];
let inv_s;
let bunkers;
let canon;
let elements = [];
let level = -1;
let count=0;
let soucoupe = null;
let bg=[];

let pD;

function windowsResized(){
	resizeCanvas(600,400);
	// resizeCanvas(windowWidth,windowHeight);
	inv_s = width/16;
	background(0);
	// les bunkers;
	let l=1;
	bunkers = Array(4).fill().map(p => new Bunker(createVector(width/9*(-1+2*l++),height*0.75)))
	bunkers.forEach(b => b.show());
	loadPixels();
	copieBG();
}
function new_level(){
	let l=1;
	lignes = Array(5).fill().map(p => new Ligne(l++,inv_s));
	l = 1;
	bunkers = Array(4).fill().map(p => new Bunker(createVector(width/9*(-1+2*l++),height*0.75)))
	ligne = 0;
	count = 8 * 5;
	level++;
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
			bg[id+1] = 0;
			bg[id+2] = 0;
			bg[id+3] = 255;
		}
	}
}
function setup() {
	// createCanvas(windowWidth,windowHeight);
	createCanvas(600,400);
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
	colorMode(HSB);
	pD = pixelDensity();
	windowsResized();
	canon = new Canon();
	// frameRate(10);
}

function keyPressed() {
	if (keyCode === LEFT_ARROW) {
		canon.move(-1);
	} else if ( keyCode === RIGHT_ARROW) {
		canon.move(+1);
	} else if (key === ' ') {
		canon.tir();
	}
}

function keyReleased() {
	canon.move(0);
}

function draw() {
	// background(0);
	copieP();
	updatePixels();
	if (count===0) new_level();
	let max = lignes.reduce( (acc, v) => { let m = v.getMax(); return m > acc ? m : acc; } , 0);
	let min = lignes.reduce( (acc, v) => { let m = v.getMin(); return m < acc ? m : acc; } , Infinity);
	lignes.forEach(  l => { 
		l.setMax(max);
		l.setMin(min);
		l.update();
		l.show();
	});

	// le canon;
	canon.update();
	canon.show();

	// la soucoupe
	if (soucoupe === null) {
		if  (random()>0.998) {
			soucoupe = new Soucoupe(inv_s);
		}
	} else {
		soucoupe.update();
		soucoupe.show();
		if ( soucoupe.isEdges() ) soucoupe =null;
	}
	
	// le Tir
	if (canon.isTir && canon.laser.pos.y > height*0.7) {
		// loadPixels();
		let x=canon.laser.pos.x;
		let y = canon.laser.pos.y+ canon.laser.vel.y;
		let id = getID(x,y,0,0);
		// printPixel(x,y);
		// colorPixel(x,y);
		if (bg[id] == 255) {
			canon.isTir = false;
			canon.laser = [];
			for (let i=0;i<200;i++) {
				let a = floor(random(-7,7));
				let b = floor(random(-12,12));
				colorPixel(x+a-2,y+b-1);
				colorPixel(x+a-4,y+b+1);
				colorPixel(x+a+3,y+b);
				colorPixel(x+a,y+b);
			}
		}
	}

	if ( soucoupe !== null && canon.isTir) {
		if( soucoupe.isTouche(canon.laser.pos) ) soucoupe = null;
	}
	if (canon.isTir) {
		lignes[ligne].invaders.forEach(i => {
			if (!canon.laser.out) {
				(i.isTouche(canon.laser.pos)) ;
			}
		});
		lignes[ligne].invaders = lignes[ligne].invaders.filter(i => !i.touche );
	}

	// les explosions
	if (elements.length >0) {
		// console.log(elements);
		elements.forEach( e => {
			e.update();
			e.isAlive();
			e.show();
		});
		elements = elements.filter(e => e.alive===true);
	}

	ligne = (ligne + 1) % 5;
}
