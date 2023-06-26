const res=100;
let grid;
let score = 0;

function keyPressed() {
	let flipped = false;
	let rotated = false;
	let played = false;
	if(keyCode === DOWN_ARROW)  
		{ played=true;} else if  (keyCode === UP_ARROW) {
			played=true;
			flipped = true;
			grid = flip(grid);
		} else if (keyCode === RIGHT_ARROW) {
			played=true;
			rotated = true;
			grid = rotateGrid(grid);
		} else if (keyCode === LEFT_ARROW) {
			played=true;
			rotated=true;
			flipped=true;
			grid = rotateGrid(grid);
			grid = flip(grid);
		}
	if (played) {
		let old = copieGrid(grid);
		for(let i=0;i<4;i++) {
			grid[i] = operate(grid[i]);
		}
		let changed = compare(grid,old);
		if (flipped) {
			grid = flip(grid);
		}
		if (rotated) {
			grid = rotateGrid(grid);
		}
		if(changed) 
			{ addNb(); }
		update();
		let gameOver = isGameOver();
		if (gameOver) {
			console.log('GAME OVER');
		}
		let gameWon = isWon();
		if (gameWon) {
			console.log('GAGNE !');
		}
	}
}
function setup() {
	noLoop();
	createCanvas(res*size,res*size);
	grid = make2Dgrid();
	addNb();addNb();
	update();
}

function update() {
	background(255);
	affGrid();
	select('#score').html(score);

}

function draw() {
}

function affGrid() {
	for (let i=0; i<4;i++) {
		for(let j=0; j<4;j++) {
			let value = grid[i][j];
			let s= value.toString();
			fill(textFormat[s].color);
			if ( new_spot == (i*size+j)) {
				strokeWeight(5);
				stroke(200,25,16);
			} else {
				strokeWeight(1);
				stroke(0);
			}
			rect(i*res,j*res,res-2,res-2,res/5);
			if (value != 0) {
				fill(textFormat[s].txtcolor);
				noStroke();
				textAlign(CENTER,CENTER);
				let ts =map(log(value),log(1),log(1024),res/3*2,res/2.5);
				textSize(ts);
				text(grid[i][j],i*res+res/2,j*res+res/2);
			}
		}
	}

}