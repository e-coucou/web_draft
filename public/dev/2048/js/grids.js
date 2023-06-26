function make2Dgrid() {
	let grid = [[0,0,0,0],
			[0,0,0,0],
			[0,0,0,0],
			[0,0,0,0]];
	return grid;
}

function flip(mat) {
	for(let i=0;i<4;i++) {
		mat[i].reverse();
	}
	return mat;
}
function rotateGrid(mat) {
	let temp = make2Dgrid();
	for(let i=0;i<4;i++) {
		for(let j=0;j<4;j++) {
			temp[i][j] = mat[j][i];
		}
	}
	// console.table(temp);
	return temp;
}
function copieGrid(source) {
	let copie = make2Dgrid();
	for (let i=0; i<4;i++) {
		for(let j=0; j<4;j++) {
			copie[i][j] = source[i][j];
		}
	}
	return copie;
}
function compare(a,b) {
	for (let i=0; i<4;i++) {
		for(let j=0; j<4;j++) {
			if (a[i][j] !== b[i][j]) { return true;}
		}
	}
	return false;
}
