function make2DArray(c, l) {

	let arr = new Array(c);
	for (let i = 0; i < arr.length; i++) {
		arr[i] = new Array(l);
	}
	return arr;
}

function fillGrid() {

}

let grid, next;
let lignes, colonnes, res = 5;

function setup() {
	// createCanvas(800,400);
	createCanvas(window.innerWidth, window.innerHeight);
	lignes = round(height / res);
	colonnes = round(width / res);

	grid = make2DArray(colonnes, lignes);

	for (let i = 0; i < colonnes; i++) {
		for (let j = 0; j < lignes; j++) {
			grid[i][j] = floor(random(2));
		}
	}
}

function draw() {
	background(51);

	for (let i = 0; i < colonnes; i++) {
		for (let j = 0; j < lignes; j++) {
			let x = i * res;
			let y = j * res;
			let w = res;
			fill((grid[i][j] == 1) * 200);
			rect(x, y, w, w);
		}
	}
	//compute next ...
	next = make2DArray(colonnes, lignes);

	for (let i = 0; i < colonnes; i++) {
		for (let j = 0; j < lignes; j++) {

			let etat = grid[i][j];
			let nbAdj = cptAdj(grid, i, j);
			if (nbAdj == 3 && etat == 0) {
				next[i][j] = 1;
			} else if (etat == 1 && (nbAdj < 2 || nbAdj > 3)) {
				next[i][j] = 0;
			} else {
				next[i][j] = etat;
			}
		}
	}
	grid = next;
}

function cptAdj(life, x, y) {
	let sum = 0;
	for (let i = -1; i < 2; i++) {
		for (let j = -1; j < 2; j++) {
			let cx = (x + i + colonnes) % colonnes;
			let cy = (y + j + lignes) % lignes;
			sum += life[cx][cy];
		}
	}
	sum -= life[x][y];
	return sum;
}