const size=5;
let nb;
let carres = [], notFall = [];
let nbTrame = 200;
let time , inc;
let offsetY = 150;
let offsetX ;
let byLigne = 40;
let timeB, t2;

function ease(p, g) {
  if (p < 0.5) 
    return 0.5 * pow(2*p, g);
  else
    return 1 - 0.5 * pow(2*(1 - p), g);
}

function setup() {
	createCanvas(400,400);
	offsetX = width/2;
	t2 = -PI/5.5; time=t2;
	timeB = time;
	inc = PI/2.5/nbTrame;
	let l1 = width*1.3;
	for(let j = 0; j<byLigne;j++) {
		let l2 = l1 -size*1.1;
		for (let i =0;i<byLigne;i++) {
			let x=[];
			x[0] = i*(l1/byLigne)+offsetX-l1/2+5;
			x[1] = (i+1)*(l1/byLigne)+offsetX-l1/2;
			x[3] = i*(l2/byLigne)+offsetX-l2/2+5;
			x[2] = (i+1)*(l2/byLigne)+offsetX-l2/2;
			let carre = new Carre(x,PI/24,size,width/3-(j*size));
			carres.push(carre);
			notFall[i+j*byLigne] = i+j*byLigne;
		}
		l1 = l2;
	}
}

let countTRame=0;

function draw() {
	// frameRate(10);
	background(0);
	t2 += inc;
	time = ease(t2,3.0);
	if (frameCount>50) {
		timeB += inc/3;
		for ( let k=0;k<15;k++) {
			if( notFall.length>0) {
				l = floor(random(notFall.length));
				// if (carres[notFall[l]].fall) console.log('erreur');
				carres[notFall[l]].toFall();
				notFall.splice(l,1);
			}
		}
	}
	// console.log(notFall.length);
	for( let i = 0; i< carres.length;i++) {
		carres[i].update();
		carres[i].show();
	}
	// if (time > 0 || time < -HALF_PI) noLoop(); //inc = -inc;
	countTRame++;
	if (frameCount === nbTrame) {
			noLoop();
	// time = -PI/6;
	// timeB = time;
	// inc = PI/3/nbTrame;
	// countTRame=0;
	// for (let i=0;i<byLigne*byLigne;i++){
	// 	carres[i].fall=false;
	// 	notFall[i]=i;
	// }
		}
	// console.log(frameCount);
	// saveFrames('pict#');
}



class Carre {
	constructor(x,x2,s,r) {
		this.x = x; // angle
		this.x2 = x2;
		this.s = s; // taille de l'élément
		this.r = r; // rayon initial 
		this.fall = false;
		this.time = 0;
		this.inc = inc;
	}

	toFall() {
		this.fall = true;
		let c = abs((-HALF_PI - time) / (nbTrame - frameCount));
		this.inc = random(c*0.4,c);

	}

	update() {
		if (this.fall) {
			if (this.time > timeB) {
				this.time = (this.time) - (this.inc);
			} else {
				this.time = timeB;
				// console.log('on fige',this.time);
			}
		} else {
			this.time = time;
		}
	}

	show() {
		let y1 = 180+(offsetY + this.r) * sin(-this.time );
		let y2 = 175+(offsetY + this.r+ this.s) * sin(-this.time);
		push();
		fill(255);
		stroke(255,10);
		beginShape();
		vertex(this.x[3],y1);
		vertex(this.x[2],y1);
		vertex(this.x[1],y2);
		vertex(this.x[0],y2);
		endShape(CLOSE);
		pop();
	}
}