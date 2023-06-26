let new_spot = -1;
const size=4;

function addNb() {
	let options=[];
	for (let i=0; i<4;i++) {
		for(let j=0; j<4;j++) {
			if (grid[i][j]==0) {
				options.push({x:i,y:j});
			}
		}
	}
	if (options.length > 0) {
		let spot = random(options);
		grid[spot.x][spot.y] = round(random(1,2))*2;
		new_spot = spot.x*size+spot.y;
	}
}
function isWon() {
	for (let i=0; i<4;i++) {
		for(let j=0; j<4;j++) {
			if (grid[i][j] == 2048) {
				return true;
			}
		}
	}
	return false;
}
function isGameOver() {
	for (let i=0; i<4;i++) {
		for(let j=0; j<4;j++) {
			if (grid[i][j] == 0) {
				return false;
			}
			if (i<3 && grid[i][j] == grid[i+1][j]) {
				return false;
			}
			if (j<3 && grid[i][j] == grid[i][j+1]) {
				return false;
			}
		}
	}
	return true;
}

function slideY(col) {
	let arr = col.filter(val => val);
	let missing = 4- arr.length;
	let zeros = new Array(missing).fill(0);
	arr = zeros.concat(arr);
	// console.table(arr);
	return arr;
}

function addFct(col) {
	for(let i=3;i>0;i--) {
		let a = col[i];
		let b= col[i-1];
		if (a == b) {
			col[i] = a + b;
			col[i-1] = 0;
			score += col[i];
		}
	}
	return col;
}

function operate(col) {
	col = slideY(col);
	col = addFct(col);
	col = slideY(col);
	return col;
}
