class Bateau {
	constructor(x,y,maxS,cible) {
		this.pos = createVector(x,y);
		this.vel = p5.Vector.random2D();
		this.acc = createVector();
		this.r =7;
		this.maxSpeed = maxS;
		this.maxForce = random(0.1,0.4);
		this.wanderTheta = -PI/2;
		this.currentPath = [];
		this.paths = [this.currentPath];

		this.xOff = random(1000);
		this.xOffinc = 0.005;
		this.cible = cible;
		this.couleur = '#ff0000';
	}

	aligne(voisins) {
		let rayon = 30;
		let total =0;
		let steering = createVector();
		for (let other of voisins) {
			let d = dist(other.pos.x,other.pos.y,this.pos.x,this.pos.y);
			if(other != this && d<rayon) {
				steering.add(other.vel);
				total++;
			}
		}
		if (total>0) { 
			steering.div(total);
			steering.setMag(this.maxSpeed);
			steering.sub(this.vel);
			steering.limit(this.maxForce);
		}
		return steering;
	}

	cohesion(voisins) {
		let rayon = 40;
		let total =0;
		let steering = createVector();
		for (let other of voisins) {
			let d = dist(other.pos.x,other.pos.y,this.pos.x,this.pos.y);
			if(other != this && d<rayon) {
				steering.add(other.pos);
				total++;
			}
		}
		if (total>0) { 
			steering.div(total);
			steering.sub(this.pos);
			steering.setMag(this.maxSpeed);
			steering.sub(this.vel);
			steering.limit(this.maxForce);
		}
		return steering;
	}

	separation(voisins) {
		let rayon = 20;
		let total =0;
		let steering = createVector();
		for (let other of voisins) {
			let d = dist(this.pos.x,this.pos.y,other.pos.x,other.pos.y);
			if(other != this && d<rayon) {
				let diff = p5.Vector.sub(this.pos,other.pos);
				diff.div(d);
				steering.add(diff); 
				total++;
			}
		}
		if (total>0) { 
			steering.div(total);
			steering.setMag(this.maxSpeed);
			steering.sub(this.vel);
			steering.limit(this.maxForce);
		}
		return steering;
	}


	flock(voisins) {
		let force = this.aligne(voisins);
		let cohesion = this.cohesion(voisins);
		let separation = this.separation(voisins);

		force.mult(aligneSlider.value());
		cohesion.mult(cohesionSlider.value());
		separation.mult(separationSlider.value());

		force.add(cohesion);
		force.add(separation);
		this.addForce(force);
	}

	wander() {
		// let force=p5.Vector.random2D();
		let wanderP = this.vel.copy();
		wanderP.setMag(70);
		wanderP.add(this.pos);
			noFill();strokeWeight(1);stroke(255);circle(wanderP.x,wanderP.y,1);
			line(this.pos.x,this.pos.y,wanderP.x,wanderP.y);

		let wanderR = 30;
		circle(wanderP.x,wanderP.y,wanderR*2);
		let theta = this.wanderTheta +this.vel.heading();
		let x = wanderR * cos(theta);
		let y = wanderR * sin(theta);
		wanderP.add(x,y);
		// let thetaRange = 0.3;
		// this.wanderTheta += random(-thetaRange,thetaRange);
		this.wanderTheta = noise(this.xOff) * TWO_PI * 2;
		this.xOff+=this.xOffinc;
			fill(0,255,0);circle(wanderP.x,wanderP.y,3);
			line(this.pos.x,this.pos.y,wanderP.x,wanderP.y);

		let force = wanderP.sub(this.pos);
		force.limit(this.maxForce); 
		this.addForce(force);
	}

	arrive(target) {
		return this.seek(target.pos,true);
	}

	pursue(vehicule) {
		let target = vehicule.pos.copy();
		let predict = vehicule.vel.copy();
		predict.mult(SEUIL);
		target.add(predict);

		// fill(0,255,0);
		// noStroke(); 
		// circle(target.x,target.y,5);

		return this.seek(target,true);
	}

	evade(vehicule) {
		let predict = this.pursue(vehicule);
		predict.mult(-1);
		return predict;
	}

	flee(target) {
		return this.seek(target).mult(-1);
	}
	seek(target,arrival=false) {
		let force = p5.Vector.sub(target,this.pos);
		let speed = this.maxSpeed;
		if (arrival) {
			let radius=100;
				// noFill(); stroke(200,170);strokeWeight(1);circle(this.pos.x,this.pos.y,radius);
			let distance = force.mag();
			if(distance<radius) {
				speed = map(distance,0,radius,0,this.maxSpeed);
			}
		}
		force.setMag(speed);
		force.sub(this.vel);
		force.limit(this.maxForce);
		return (force);
	}

	addForce(force) {
		this.acc.add(force);
	}

	update() {
		this.vel.add(this.acc);
		this.vel.limit(this.maxSpeed);
		this.pos.add(this.vel);
		this.acc.mult(0); 

		this.currentPath.push(this.pos.copy());
	}
	show() {
		push();
		translate(this.pos.x,this.pos.y);
		rotate(this.vel.heading());rotate(PI/2);
		fill(this.couleur);
		stroke(this.couleur);
		strokeWeight(1);
		triangle(-this.r,0,this.r,0,0,-3*this.r);
		pop();
	}

	attrap() {
		let d = dist(this.pos.x,this.pos.y,targets[this.cible].pos.x,targets[this.cible].pos.y);
		if (d<SEUIL/2) {
			return true;
		} else { return false; }
	}

	edge() {
		let edge=false;
		let target = this.pos.copy();
		let predict = this.vel.copy();
		predict.mult(SEUIL);
		target.add(predict);
		let d = dist(target.x,target.y,width/2,edgeY/2);
		if (d<RADIUS+SEUIL/10) {
			let evite = createVector(width/2-target.x,edgeY/2-target.y);
			this.vel.sub(evite.setMag(0.2)).limit(this.maxSpeed);
		}
		// console.log(target,this);
		if(this.pos.x>=width) { this.pos.x=0;edge=true;}
		if(target.y>=edgeY) {
			this.vel.add(predict.div(SEUIL).mult(1,-1.05));
			edge=true;}
		// if(this.pos.y>=height) {this.pos.y=0; edge=true;}
		// this.pos.x %= width;
		// this.pos.y %= height;
		if (this.pos.x<0) {this.pos.x=width; edge=true;}
		if (target.y<0) {
			this.vel.add(predict.div(SEUIL).mult(1,-1.05));
			edge = true;}
		// if (this.pos.y<0) {this.pos.y=height; edge = true;}

		if(edge) {
			this.currentPath=[];
			this.paths.push(this.currentPath);
		}
	}
}


class Target extends Bateau {
	constructor(x,y,maxS) {
		super(x,y,maxS);
		this.vel = p5.Vector.random2D();
		this.acc = p5.Vector.random2D();
		this.maxForce=0.05;
		this.couleur=(255,127);
		this.r = 3;
		this.chasseur = -1;
	}
	show() {
		push();
		translate(this.pos.x,this.pos.y);
		rotate(this.vel.heading());rotate(PI/2);
		if (this.chasseur != -1) {
			fill(0,255,0,127);
			stroke(0,255,255);
		} else {
			fill(this.couleur);
			stroke(255);
		}
		strokeWeight(1);
		triangle(-this.r,0,this.r,0,0,-3*this.r);
		pop();


		// push();
		// translate(this.pos.x,this.pos.y);
		// fill('#F06A44');
		// stroke(255);
		// strokeWeight(2);
		// circle(0,0,this.r);
		// pop();

		// stroke(255);noFill();strokeWeight(1);
		// beginShape();
		// for (let v of this.currentPath) {
		// 	vertex(v.x,v.y);
		// }
		// endShape();
	}
}
