let rows, cols;
let w = 40;
let grid = [];
let current;
let stack = []; 

function setup() {
	createCanvas(800,800);
	rows = floor(width/w);
	cols=floor(height/w);

	for (let j=0;j<rows;j++ ){
		for(let i =0;i<cols;i++) {
			cell = new Cell(i,j);
			grid.push(cell);
		}
	}
	current= grid[0];
	current.checkVoisins();
}

function draw() {
	// frameRate(5);
	background(51);
	for (c=0;c<grid.length;c++) {
		grid[c].show();
	}
	current.visited=true;
	current.highlight();
	let next = current.checkVoisins();
	if (next) { 
		next.visited = true;
		stack.push(current);
		removeWalls(current,next);
		current = next;
	} else {
		if (stack.length>0) {
			current = stack.pop();
		}
	}
}

function index(i,j) {
	let id = (i + j * cols);
	if (i<0 || i>= cols || j<0 || j>= rows) return -1;
	return id;
}

function Cell(i,j) {
	this.i = i;
	this.j = j;
	this.wall = [true,true,true,true]; 
	this.visited = false;

	this.highlight = function() {
		let x = this.i *w;
		let y = this.j *w;
		fill(200,0,150,255);
		noStroke();
		rect(x,y,w,w);
	}
	this.checkVoisins = function(){
		let voisins = [];

		let top = grid[index(this.i,this.j-1)];
		let right = grid[index(this.i+1,this.j)];
		let left = grid[index(this.i-1,this.j)];
		let bottom = grid[index(this.i,this.j+1)];

		if (top && !top.visited) {
			voisins.push(top);
		}
		if (right && !right.visited) {
			voisins.push(right);
		}
		if (left && !left.visited) {
			voisins.push(left);
		}
		if (bottom && !bottom.visited) {
			voisins.push(bottom );
		}

		if (voisins.length>0) {
			let n = floor(random(voisins.length));
			// current = grid[index(n)];
			return voisins[n];
		} else return undefined;

	}

	this.show = function () {
		let x = this.i *w;
		let y = this.j *w;
		stroke(255);
		if (this.wall[0]) {line(x,y,x+w,y);}
		if (this.wall[1]) {line(x+w,y,x+w,y+w);}
		if (this.wall[2]) {line(x+w,y+w,x,y+w);}
		if (this.wall[3]) {line(x,y+w,x,y);}

		if (this.visited) {
			fill(0,200,200,127);
			noStroke();
			rect(x,y,w,w);
		}
	}
}

function removeWalls(a,b) {
	let x = a.i - b.i;
	if (x === 1) {
		a.wall[3] = false;
		b.wall[1] = false;
	} else if (x === -1) {
		a.wall[1] = false;
		b.wall[3] = false;
	}
	let y = a.j - b.j;
	if (y === 1) {
		a.wall[0] = false;
		b.wall[2] = false;
	} else if (y === -1) {
		a.wall[2] = false;
		b.wall[0] = false;
	}
}
