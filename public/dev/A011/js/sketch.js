const eC = {version: 'r01'};
const LEVEL = 12;
let iter = 0;
let angle;
let bases = [];
let branches = [];

function setup() {
	createCanvas(600,400);
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
	angle = PI/10;
	bases.push({a: -PI/2, l: height/8, e: 20, pos: createVector(width/2,height)});
}

function draw() {
	background(255);
	if (iter<LEVEL) {
		for (b of bases) {
			branches.push(new Branche(b,iter));
		}
		bases = [];
		for (b of branches) {
			b.show();
			if (b.level === iter) {
				bases = bases.concat(b.next());
				// base = b.next();
				// bases.push(base[0]);
				// bases.push(base[1]);
			}
		}
		iter++;
	} else {
		for (b of branches) {
			// b.jitter();
			b.show();
		}
	}
}


//-----------------
class Branche {
	constructor(base,level) {
		this.level = level;
		this.l = base.l;
		this.a = base.a;
		this.e = base.e;
		this.p1 = base.pos;
		this.p2 = p5.Vector.fromAngle(base.a).setMag(base.l).add(base.pos);
		this.scale = 0.88;
		this.asym = PI/28;
	}

	show() {
		push();
		noFill();
		let c1 = color(0x73,0x2F,0x23);
		let cx = random(0x96,0xF6);
		let c2 = color(cx,0xCF,0x33);
		let c = lerpColor(c1,c2,this.level/LEVEL);
		stroke(c);
		// let w = map(this.level,0,LEVEL,20,1);
		strokeWeight(this.e);
		line(this.p1.x,this.p1.y,this.p2.x,this.p2.y);
		pop();
	}

	next() {
		let nb = 2; //floor(random(3,3));
		let li =[], ei = [], ai = [];
		let ret = [];
		for (let i=0;i<nb;i++) {
			li.push(this.l*this.scale * random(8,10)/9.2);
			// let l2 = this.l*this.scale * random(8,10)/9.2;
			ei.push(this.e * random(65,90) / 100);
			// let e2 = this.e * random(65,90) / 100;
			ai.push(this.a+(-1+(i%2)*2)*angle + (-1+(i%2)*2 )*(random()>=0.5)*this.asym);
			// let a2 = this.a+angle + (random()>=0.5)*this.asym;
			ret.push({a: ai[i] ,l: li[i],e: ei[i] ,pos:this.p2});
		}
		return ret;
	}

	jitter() {
		this.p1.x += floor(random(-1,1));
		this.p1.y += floor(random(-1,1));
	}
}