//---------------
// BINARY TREE --
const eC = {version: 'r01'};

let tree;
let total = 1, n=0;
let w = 40;
let h = 20;
let last;

function windowsResized(){
	resizeCanvas(windowWidth,windowHeight);
}
function setup() {
	createCanvas(windowWidth,windowHeight);
	// createCanvas(windowWidth,400);
	background(51);
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
	tree = new Tree();
	// for (let i = 0; i<100;i++) {
	// 	tree.addValue(floor(random(1,100)));
	// }

	console.log(tree);

	// tree.list();
	// frameRate(1);
}

function draw() {
	if (n++<total) {
		last = floor(random(1,100));
		tree.addValue(last);
		tree.display(last);
	} else tree.display(last);
}


//-------------
class Node {
	constructor(v_,x_,y_) {
		this.value = v_;
		this.left = null;
		this.right = null;
		this.x = x_;
		this.y = y_;
		this.exist = false;
	}
	search(v_) {
		if (this.value === v_) {
			return this;
		} else if ( v_ < this.value && this.left !== null ) { return this.left.search(v_);
		} else if (v_ > this.value && this.right !== null ) { return this.right.search(v_);
		}
		return null;
	}

	display(p_,v_) {
		if (this.left !== null ) this.left.display(this,v_);
		stroke(255);
		line(this.x,this.y,p_.x,p_.y);
		(this.value===v_)?fill(255,0,0):fill(0);
		if (this.exist) fill(0,155,12);
		circle(this.x,this.y,20);
		stroke(255); fill(255);
		textAlign(CENTER);
		text(this.value,this.x,this.y+3);
		//redraw previous for right nodes
		(p_.value===v_)?fill(255,0,0):fill(0);
		if (p_.exist) fill(0,155,12);
		circle(p_.x,p_.y,20);
		stroke(255); fill(255);
		textAlign(CENTER);
		text(p_.value,p_.x,p_.y+3);

		if (this.right !== null ) this.right.display(this,v_);
	}
	list() {
		if (this.left !== null ) this.left.list();
		console.log(this.value);
		if (this.right !== null ) this.right.list();
	}
	addNode(n_,l_) {
		if (n_.value > this.value) {
			if (this.right === null) {
				n_.x = this.x + max(width/pow(2,++l_),10);
				n_.y = this.y + 30;
				this.right = n_;
			} else {
				this.right.addNode(n_,++l_);
			}
		} else if (n_.value < this.value) {
			if (this.left === null) {
				n_.x = this.x - max(width/pow(2,++l_),10);
				n_.y = this.y + 30;
				this.left = n_;
			} else {
				this.left.addNode(n_,++l_);
			}
		} else if (n_.value === this.value) {
			this.exist = true;
		}
	}
}


//-------------
class Tree {
	constructor() {
		this.root = null;
	}

	display(v_) {
		this.root.display(this.root,v_);
	}

	list() {
		this.root.list();
	}

	search(v_) {
		return this.root.search(v_);
	}

	addValue(n_) {
		last = n_;
		let node = new Node(n_);
		if (this.root=== null) {
			node.x = width/2;
			node.y = 20;
			this.root = node;
		} else {
			this.root.addNode(node,1);
		}
	}
}