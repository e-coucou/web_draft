function Bird(x,y,dna) {
	this.pos = createVector(x,y);
	this.vel = createVector(floor(random(-2,2)),floor(random(-2,2)));
	this.acc = createVector(0,0);
	this.r = 4;
	this.maxSpeed = 5;
	this.maxForce = 0.5;
	this.dna = [];
	this.health = 1;
	this.limit = 25;

	if (dna === undefined) {
		// food weigth
		this.dna[0] = random(-2,2);
		// poison weight
		this.dna[1] = random(-2,2);
		// food perception
		this.dna[2] = random(10,100);
		// poison perception
		this.dna[3] = random(10,100);
	} else {
		this.dna = dna.slice();
	}

	this.update = function() {
		this.vel.add(this.acc);
		this.vel.limit(this.maxSpeed);
		this.pos.add(this.vel);
		this.acc.mult(0);
		this.health -= 0.005;
	}

	this.force = function(force) {
		this.acc.add(force);
	}

	this.seek = function(target) {
		let desired = p5.Vector.sub(target,this.pos);
		desired.setMag(this.maxSpeed);

		let steer = p5.Vector.sub(desired,this.vel);
		steer.limit(this.maxForce);
		return steer;
	}

	this.behavior = function (Good,Bad) {
		let steerG = this.eat(Good,+0.15,this.dna[2]);
		let steerB = this.eat(Bad,-0.5,this.dna[3]);

		steerG.mult(this.dna[0]);
		steerB.mult(this.dna[1]);

		this.force(steerB);
		this.force(steerG);
	}

	this.eat = function (targets,nutrition,perception) {
		let nearest = Infinity, proche= null;

		for (let i = targets.length-1;i>=0;i--) {
			let d = dist(this.pos.x, this.pos.y, targets[i].x, targets[i].y);
			if (d < this.maxSpeed) {
				targets.splice(i,1);
				this.health += nutrition;
			} else if (d < nearest && d < perception) {
				nearest = d;
				proche=targets[i];
			}
		}

		if (nearest< Infinity) { 
			return this.seek(proche);
		}

		return createVector(0,0);
	}

	this.dead = function () {
		return (this.health <0);
	}

	this.clone = function() {
		if (Math.random(1) < 0.005) {
			return new Bird(this.pos.x,this.pos.y,this.dna);
		} else {
			return null;
		}
	}

	this.edge = function () {
		let desired = null;

		if (this.pos.x<this.limit) {
			desired = createVector(this.maxSpeed,this.vel.y);
		} else if (this.pos.x > width-this.limit) {
			desired = createVector(-this.maxSpeed,this.vel.y);
		}
		if (this.pos.y<this.limit) {
			desired = createVector(this.vel.x,this.maxSpeed);
		} else if (this.pos.y > height-this.limit) {
			desired = createVector(this.vel.x,-this.maxSpeed);
		}
		if (desired !== null) {
			desired.normalize();
			desired.mult(this.maxSpeed);
			let steer = p5.Vector.sub(desired,this.vel);
			steer.limit(this.maxForce);
			this.force(steer);
		}
	}

	this.show = function() {
		let a = this.vel.heading(); // + PI/2;
		let c1 = color(255,0,0);
		let c2 = color(0,255,0);
		let couleur = lerpColor(c1,c2,this.health);
		push();
		stroke(couleur);
		fill(couleur);
		translate(this.pos.x,this.pos.y);
		rotate(a);
		beginShape()
		// circle(0, 0, this.r);
		vertex(0,-this.r);
		vertex(0,this.r);
		vertex(3*this.r,0);
		endShape(CLOSE);
		if (debug.checked()) {
			noFill()
			stroke(0,255,0);
			line(0,0,this.dna[0]*10,0);
			circle(0,0,this.dna[2]*2);
			stroke(255,0,0);
			line(0,0,this.dna[1]*10,0);
			circle(0,0,this.dna[3]*2);
		}
		pop();
	}
}