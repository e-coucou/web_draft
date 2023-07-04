let table = [
			['','',''],
			['','',''],
			['','','']						]

let homme = 'O';
let AI = 'X';
let player;
let casesLibre=[];
let w,h;

let scores = { X:1, O:-1, PAT:0};

function setup() {
	canvas = createCanvas(400,400);
	canvas.parent("#canvas");

	w = width / 3;
	h = height / 3;

	player = homme;
	// player = floor(random(2));
// 	frameRate(2);
	bestPlay();
}

function mousePressed() {
	let i = floor(mouseX/w);
	let j = floor(mouseY/h);
	if (table[i][j] == '') {
		table[i][j] = homme;
		player = AI;
		// next();
		bestPlay();
	}
}

function minimax(table,niv,isMax) {
	let res = victoire();
	if (res != null) {
		// console.log(scores[res]);
		return scores[res];
	}
	if (isMax) {
		let bestScore = -Infinity;
		for (let j=0 ; j<3 ; j++) {
			for (let i=0 ; i<3 ; i++) {
				if (table[i][j] == '') {
					table[i][j] = AI;
					let score = minimax(table, niv+1, false);
					table[i][j] = '';
					bestScore = max(score, bestScore);
				}
			}
		}
		return bestScore;
	} else {
		let bestScore = Infinity;
		for (let j=0 ; j<3 ; j++) {
			for (let i=0 ; i<3 ; i++) {
				if (table[i][j] == '') {
					table[i][j] = homme;
					let score = minimax(table, niv+1, true);
					table[i][j] = '';
					bestScore = min(bestScore, score);
				}
			}
		}
		return bestScore;
	}
}

function bestPlay() {
	let Pick;
	let bestScore = -Infinity;
	for (let j=0;j<3;j++) {
		for (let i=0;i<3;i++) {
			if (table[i][j] == '') {
				table[i][j] = AI;
				let score = minimax(table, 0 , false);
				table[i][j] = '';
				if (score > bestScore) {
					bestScore = score;
					Pick = {i,j};
				}
			}
		}
	}
	table[Pick.i][Pick.j] = AI;
	player = homme;
}

// function next() {
// 	casesLibre = [];
// 	for (let j=0;j<3;j++) {
// 		for (let i=0;i<3;i++) {
// 			if (table[i][j] == '') {
// 				casesLibre.push({i,j});
// 			}
// 		}
// 	}
// 	if (casesLibre.length>0) {
// 		let play = random(casesLibre);
// 		table[play.i][play.j] = player;
// 		player = homme;
// 	}
// }
// function joue() {
// 	let idx = floor(random(casesLibre.length));
// 	let tick = casesLibre[idx];
// 	casesLibre.splice(idx,1);
// 	let i = tick[0];
// 	let j = tick[1];
// 	table[i][j] = players[player];
// 	player = (player+1) % 2;
// }

function egal3(a,b,c) {
	return ( a==b && a==c && a!='');
}

function victoire() {
	let gagnant=null;
	//ligne Horizontale
	for (let i=0; i<3; i++) {
		if (egal3(table[i][0],table[i][1],table[i][2])) {
			gagnant = table[i][0];
		}
	}
	//ligne Verticale
	for (let i=0; i<3; i++) {
		if (egal3(table[0][i],table[1][i],table[2][i])) {
			gagnant = table[0][i];
		}
	}
	// croix
	if (egal3(table[0][0],table[1][1],table[2][2])) {
		gagnant = table[0][0];
	}
	if (egal3(table[0][2],table[1][1],table[2][0])) {
		gagnant = table[0][2];
	}
	let libre=0;
	for (let j=0 ; j<3 ; j++) {
		for (let i=0 ; i<3 ; i++) {
			if (table[i][j] == '') libre++;
		}
	}
	if (gagnant == null && libre==0) {
		return 'PAT';
	} else {
		return gagnant;
	}
}

function affiche() {
	textAlign(CENTER,CENTER);
	textSize(64);
	stroke(255);
	fill(255);
	line(0,h,width,h);
	line(0,2*h,width,2*h);
	line(w,0,w,height);
	line(2*w,0,2*w,height);
	for (let j=0 ; j<3 ; j++) {
		for (let i=0 ; i<3 ; i++) {
			let v = table[i][j];
			let x = w * (i+0.5);
			let y = h * (j+0.5);
			text(v,x,y);
		}
	}
}

function draw() {
	background(110);
	affiche();
	if (victoire() != null) {
		console.log(victoire());
		noLoop();
	}
}