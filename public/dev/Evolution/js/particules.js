class Particule {
    constructor(pos) {
        this.pos=pos;
        this.vel = new Vector(0,0,0);
        this.acc = new Vector(0,0,0);

        this.setType(Math.pow(3,round(random(0,3))));

        // caracteristiques physique
            this.r = 10;
            this.masse = 1.0
            this.maxSpeed = 2;
        //wander parametres
            this.wanderTheta = -PI/2;
            this.xOff = random(1000);
            this.xOffinc = 0.1;
            this.maxForce = random(0.1,0.4);

    }

    setType(t) {
        this.type = t;
        switch(t) {
            case 1: this.couleur=color(0,255,0); break; // Energie / precurseur
            case 3: this.couleur=color(255,0,0); break; // Catalyseur
            case 9: this.couleur=color(255,0,255); break; // Intermediare
            case 27: this.couleur=color(255,255,0); break; // Polaire
        }
    }
    setEdge(x1,y1,x2,y2) {
        this.HGx = x1;
        this.HGy = y1;
        this.BDx = x2;
        this.BDy = y2;
    }
    
    solveCollision(p,d) {
        let dir = Vector.sub(p.pos,this.pos);

            let corr = (20 - d) /2;
            dir.mult(1/d);
            this.pos.sub(dir,corr);
            p.pos.add(dir,corr);
            let v1 = Vector.dot2D(this.vel,dir);
            let v2 = Vector.dot2D(p.vel,dir);
            let m1 = this.masse;
            let m2 = p.masse;
            let frein = 1;
            let newV1 = (m1*v1 + m2*v2 - m2*(v1-v2)*frein) / (m1+m2);
            let newV2 = (m1*v1 + m2*v2 - m1*(v2-v1)*frein) / (m1+m2);
            this.vel.add(dir,newV1-v1);
            p.vel.add(dir,newV2-v2);
    }
    solveCohesion(p) {
		let steering = new Vector(0,0,0);
		steering.add(p.pos);
		steering.sub(this.pos);
		steering.setMag2D(0.1); //this.maxSpeed);
		steering.sub(this.vel);
		steering.limit2D(100); //this.maxForce);
    	return steering;
    }    
    collision(voisins) {
		let rayon = 10;
		let steering = new Vector(0,0,0);
		for (let other of voisins) {
            let col=0;
            if (other != this) {
                col = (this.type+other.type);
            }
			let d = Vector.dist2D(Vector.sub(other.pos,this.pos));
            switch (col) {
                case 4: if (d<rayon) {
                        this.solveCollision(other,d);
                        other.setType(3);
                        this.setType(9);
                    }
                    break;
                case 10: if (d<rayon) {
                        this.solveCollision(other,d);
                        other.setType(3);
                        this.setType(27);
                    }
                    break;
                case 54: if (d<rayon) {
                        let nThis = Vector.norm2D(this.vel);
                        let nOther = Vector.norm2D(other.vel);
                        let dir = Vector.dot2D(nThis, nOther);
                        // console.log('Collision de jaune',col,dir);
                        if (dir>0.8) {
                            this.solveCohesion(other);
                            console.log('cohesion');
                        } else {
                            this.solveCollision(other,d);
                        }
                        // other.setType(3);
                        // this.setType(27);
                    }
                    break;
            }
		}
    	return steering;
    }
	
    separation(voisins) {
		let rayon = 40;
		let total =0;
		let steering = new Vector(0,0,0);
		for (let other of voisins) {
            let col = (this.type+other.type);
            let d = Vector.dist2D(Vector.sub(this.pos,other.pos));
            switch (col) {
                case 4:
                    // strokeWeight(1);stroke(120);line(this.pos.x(),this.pos.y(),other.pos.x(),other.pos.y());
                    if(d<rayon) {
                        // console.log('ici',d)
                    // strokeWeight(4);stroke(255);line(this.pos.x(),this.pos.y(),other.pos.x(),other.pos.y());
                        let diff = Vector.sub(this.pos,other.pos);
                        diff.mult(1/d);
                        steering.add(diff); 
                        total++;
                        other.setType(3);
                        this.setType(9);
                        // this.r = 20; other.r = 20
                    }
                    break;
                case 10:
                    if( d<rayon) {
                        let diff = Vector.sub(this.pos,other.pos);
                        diff.mult(1/d);
                        steering.add(diff); 
                        total++;
                        other.setType(3);
                        this.setType(27);
                        // this.r = 20; other.r = 20
                    }
                    break;
            }
		}
		if (total>0) { 
			steering.mult(1/total);
			steering.setMag2D(this.maxSpeed);
			steering.sub(this.vel);
			steering.limit2D(this.maxForce);
		}
		return steering;
	}
    
    cohesion(voisins) {
		let rayon = 40;
		let total =0;
		let steering = new Vector(0,0,0);
		for (let other of voisins) {
			let d = Vector.dist2D(Vector.sub(other.pos,this.pos));
			if(other != this && d<rayon) {
				steering.add(other.pos);
				total++;
			}
		}
		if (total>0) { 
			steering.div(total);
			steering.sub(this.pos);
			steering.setMag2D(10);
			steering.sub(this.vel);
			steering.limit2D(this.maxForce);
		}
    	return steering;
    }
	flock(voisins) {
		// let force = this.separation(voisins);
		let force = this.collision(voisins);
        // this.aligne(voisins);
		// let cohesion = this.cohesion(voisins);
		// let separation = this.separation(voisins);

		// force.add(cohesion);
		// force.add(separation);
		this.addForce(force);
	}


	wander() {
		// let force=p5.Vector.random2D();
		let wanderP = this.vel.copy();
		wanderP.setMag2D(10);
		wanderP.add(this.pos);
			// noFill();circle(wanderP.x(),wanderP.y(),1);
            if (this.type == 27) {
    			strokeWeight(1);stroke(255,255,0);line(this.pos.x(),this.pos.y(),wanderP.x(),wanderP.y());
            }

		let wanderR = 5;
		// circle(wanderP.x(),wanderP.y(),wanderR*2);
		let theta = this.wanderTheta +this.vel.heading();
		let x = wanderR * cos(theta);
		let y = wanderR * sin(theta);
		wanderP.e[0] += x;
        wanderP.e[1] += y;
		// let thetaRange = 0.3;
		// this.wanderTheta += random(-thetaRange,thetaRange);
		this.wanderTheta = noise(this.xOff) * TWO_PI * 2;
		this.xOff+=this.xOffinc;
            // noStroke();
			// fill(0,255,0);circle(wanderP.x(),wanderP.y(),5);
            // stroke(0,0,255)
			// line(this.pos.x(),this.pos.y(),wanderP.x(),wanderP.y());

		let force = wanderP.sub(this.pos);
		force.limit2D(this.maxForce); 
		this.addForce(force);
	}

    update() {
        this.vel.add(this.acc);
        this.vel.limit2D(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.zero();
    }

    addForce(f) {
        this.acc.add(f);
    }

    run(voisins) {
        if (this.type != 27) this.wander();
        this.flock(voisins)
        this.update();
        return this.edge();
    }
    edge() {
        if (this.pos.x()<this.HGx || this.pos.x()>this.BDx || this.pos.y()<this.HGy || this.pos.y()>this.BDy) {
            return false;
        }
        return true;
    }

    show() {
        fill(this.couleur);
        noStroke();
        circle(this.pos.x(),this.pos.y(),this.r);
        if (this.type == 27) {
            noFill();stroke(255);strokeWeight(1);
            let dir = Vector.setMag2D(this.vel,10);
            dir.add(this.pos);
            line(this.pos.x(), this.pos.y(),dir.x(),dir.y());
        }
        // noFill();stroke(255);strokeWeight(1);
        // circle(this.pos.x(),this.pos.y(),40)
    }
}