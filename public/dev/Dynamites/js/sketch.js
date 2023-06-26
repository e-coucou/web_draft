function make2DArray(c,l) {
	let arr = new Array(c);
	for(let i=0; i<arr.length;i++) {
		arr[i] = new Array(l);
	}
	return arr;
}

let grid;
let colonnes, lignes, res=30;
let nbBombe;
let reste;
let resteDiv;
let gagne=false;

function keyPressed() {
 if (key == ' ') {
		for(let i = 0;i<colonnes;i++){
			for(let j=0;j<lignes;j++){
				let flag = grid[i][j].val(mouseX,mouseY);
				if (flag) {
					grid[i][j].flag = !grid[i][j].flag;
				}
			}
		}
	}
	show();
}
function mousePressed() {
	if (mouseButton == LEFT) {
		for(let i = 0;i<colonnes;i++){
			for(let j=0;j<lignes;j++){
				let open = grid[i][j].val(mouseX,mouseY);
				if (open) {
					grid[i][j].ouvre();
					if (grid[i][j].bombe) {
						gameOver();
					}
				}
			}
		}
	}
	show();
}

function win() {
	ouvreAll();
	gagne=true;
}
function ouvreAll() {
	for(let i = 0;i<colonnes;i++){
		for(let j=0;j<lignes;j++){
			grid[i][j].ouvre();
		}
	}
}
function gameOver() {
	ouvreAll();
	gagne=false;
}

function setup() {
	createCanvas(800,400);
	colonnes=floor(width/res);
	lignes=floor(height/res);
	reste = colonnes*lignes;
	nbBombe = floor(0.1*reste);
	grid = make2DArray(colonnes,lignes);
	for(let i = 0;i<colonnes;i++){
		for(let j=0;j<lignes;j++){
			grid[i][j]=new cell(i,j,res);
			grid[i][j].flag=false;
		}
	}
	let n=0;
	while (n<nbBombe) {
		let i = floor(random(colonnes));
		let j = floor(random(lignes));
		if (!grid[i][j].bombe) {
			grid[i][j].bombe=true;
			n++;
		}
	}

	for(let i = 0;i<colonnes;i++){
		for(let j=0;j<lignes;j++){
			grid[i][j].cpt = grid[i][j].cptAdj();
		}
	}
	resteDiv = createDiv();
	noLoop();
	show();
}

function draw() {
}

function show() {
	background(255);
	for(let i = 0;i<colonnes;i++){
		for(let j=0;j<lignes;j++){
			grid[i][j].show();
		}
	}
	resteDiv.html(reste);
}