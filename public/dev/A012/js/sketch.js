const eC = {version: 'r01'};
let angle;
let len = 150;
let bouton;
let phrase = 'F';
let rules = {a:'F', b:'FF+[+F-F-F]-[-F+F+F]'}

function setup() {
	createCanvas(600,600);
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
	bouton = createButton('Generate');
	bouton.mousePressed(generate);
	angle = PI/6;
	affiche(); 
}

function generate() {
	let nP = "";
	len *= 0.5;
	for (let i=0;i<phrase.length;i++) {
		let c = phrase.charAt(i);
		let found = false;
		if (c===rules.a) {
			found=true;
			nP += rules.b;
		} else { nP += c ;}
	}
	phrase = nP;
	affiche();
}

function affiche() {
	background(0);
	resetMatrix();
	translate(width/2,height);
	noFill();
	stroke(255,125);
	for (let i = 0; i< phrase.length;i++) {
		let c = phrase.charAt(i);
		if (c==='F') {
			line(0,0,0,-len);
			translate(0,-len);
		} else if (c === '+') {
			rotate(angle);
		} else if (c === '-') {
			rotate(-angle);
		} else if (c === '[') {
			push();
		} else if (c === ']') {
			pop();
		}
	}
}