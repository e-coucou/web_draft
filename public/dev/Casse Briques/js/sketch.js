let paddle, ball;
let briques = [];
const bSize=40;
const bPoly = 6;

let newGame = false;

function setup() {
	createCanvas(840,550);
	paddle = new Paddle();
	ball = new Ball();
	init_briques();
	// ball.addForce(createVector(random(-5,5)));
}

function init_briques() {
	let nbBrX = floor(width / bSize / 2);
	let nbBrY = floor(height / 1.3 / bSize /2);
	for (let i = 0; i<nbBrY;i++) {
		for (let j=0;j<nbBrX;j++) {
			let brique = new Brique(createVector(j*bSize*2 + bSize,i*bSize*2+bSize),bSize,bPoly);
			briques.push(brique);
		}
	}

}

function keyPressed() {
	if (keyCode === LEFT_ARROW) {
		paddle.moveL = true;
	} else if ( keyCode === RIGHT_ARROW) {
		paddle.moveR = true;
	} else if (key == 's' || key == 'S') { newGame = true;}
}
function keyReleased() {
	paddle.moveR=false;
	paddle.moveL=false;
}

function draw() {
	background(0);

	if (newGame) init_briques();
	// Paddle
	paddle.update();
	paddle.edges();
	paddle.show();

	// Ball
	ball.edges();
	ball.meet(paddle);
	ball.update();
	ball.show();

	//Briques
	for (let i= briques.length-1; i>=0; i--) {
		if(ball.hits(briques[i])) { 
			if (briques[i].r === bSize) {
				briques[i].r = bSize/2;
				ball.addForce(5);
			} else 
			{	briques.splice(i,1);}
			ball.vel.y *= random(-1.2,-0.8); ball.vel.x *= random(-1.2,-0.8);
		} else {	briques[i].show(); }
	}
}