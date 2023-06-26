const eC = {version: 'r01'};
let arbre = [];
let d_detect = 50;
let d_link = 4;

function setup() {
	createCanvas(600,600);
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
	arbre = new Arbre(100);
}

function draw() {
	background(0);
	arbre.show();
	arbre.grow();
	if (frameCount % 10 === 0) {
		for(let i =0;i<10;i++) {
			let a = map(random(),0,1,-PI/6,7/6*PI);
			let r = random(20,width/2);
			let x = r * cos(a) + width/2;
			let y = -r * sin(a) + height/2;
			arbre.feuilles.push(new Feuille(createVector(x,y)));
		}
	} 
}

function mousePressed() {
	arbre.feuilles.push(new Feuille(createVector(mouseX,mouseY)));	
}

//------------------
class Arbre {
	constructor(N) {
		this.feuilles = [];
		this.branches = [];

		for (let i=0; i<N;i++) {
			let a = map(random(),0,1,-PI/6,7/6*PI);
			let r = random(20,width/2);
			let x = r * cos(a) + width/2;
			let y = -r * sin(a) + height/2;
			this.feuilles.push(new Feuille(createVector(x,y)));
		}
		let pos = createVector(width/2, height);
		let dir = createVector(0,-1);
		let root = new Branche(pos,null,dir);
		this.branches.push(root);

		let current = root;
		let found = false;

		while (!found) {
			for (let f of this.feuilles) {
				let d = p5.Vector.dist(current.pos,f.pos);
				if (d < d_detect) {
					found = true;
				}
			}
			if (!found) {
				let nextB = current.next();
				current = nextB;
				this.branches.push(current);
			}
		}
	}

	grow() {
		for (let f of this.feuilles) {
			let rec = 10000;
			let nearB = null;
			for(let j= this.branches.length-1;j>=0; j--) {
				let b = this.branches[j];
				let d = p5.Vector.dist(b.pos,f.pos);
				if (d<d_link) {
					f.connect = true;
					nearB = null;
					break; 
				} else if (d > d_detect) { 
				} else if (d < rec) {
					rec = d;
					nearB = b; 
				}
			}
			if (nearB != null) {
				let Newdir = p5.Vector.sub(f.pos,nearB.pos); 
				Newdir.normalize();
				nearB.dir_.add(Newdir);
				nearB.count++;
			}
		}

		for (let i = this.feuilles.length-1;i>=0;i--) {
			if (this.feuilles[i].connect === true) {
				this.feuilles.splice(i,1);
			}
		}
		for(let j= this.branches.length-1;j>=0; j--) {
			let b = this.branches[j];
			if (b.count>0) {
				b.dir_.div(b.count);
				let rDir = p5.Vector.random2D();
				b.dir_.add(rDir.setMag(0.4));
				b.dir_.normalize();
				this.branches.push( b.next());
			}
			b.resetB();
		}
	}

	show() {
		for (let f of this.feuilles) {
			f.show();
		}
		let i=0;
		for (let b of this.branches) {
			let sw = map(i++,0,this.branches.length,10,0);
			b.show(sw );
		}
	}

}



//--------
class Feuille {
	constructor(pos) {
		this.pos = pos; //createVector(random(width),random(height*2/3));
		this.r = 2;
		this.connect = false;
	}

	show() {
		noStroke();
		fill(255);
		circle(this.pos.x,this.pos.y,this.r);
	}

}


//----------
class Branche {
	constructor(pos,avant,dir) {
		this.pos = pos;
		this.avant = avant;
		this.dir_ = dir;

		this.Odir = this.dir_.copy();
		this.count = 0;
	}

	resetB() {
		this.count=0;
		this.dir_ = this.Odir.copy();
	}

	next() {
		let nextPos = p5.Vector.add(this.pos,this.dir_);
		let nextBranche = new Branche(nextPos,this.pos,this.dir_.copy());

		return nextBranche;
	}

	show(sw) {
		stroke(255); noFill();
		if (sw !== null) { strokeWeight(sw); } else {strokeWeight(1);}
		if (this.avant !== null) {
			line(this.pos.x,this.pos.y,this.avant.x,this.avant.y);
		}
	}
}