const dt = 1.0 /30.0; // 60 trames par seconde
const gravite = new Vector2(0,-9.81);

class Particule {
    constructor(x_,y_,c_=color(255,120,0),m_=1) {
        this.pos = new Vector2(x_,y_);
        this.posPrev = new Vector2(0,0);
        this.vel = new Vector2(0,0);
        this.acc = new Vector2(0,0);
        this.color = c_;
        this.masse = m_;
        this.rayon = m_/2/scale;
    }

    setVelocite(v) {
        this.vel = v;
    }

    applyForce(f) {
        this.acc.add(f);
    }

    simul() {
        this.update();
        this.edge();
        this.show();
    }
    edge(dtS_) {
        // let dtS=0.1;
        let dtS = dtS_;
        if (this.pos.x<(this.rayon+4.7)) { let dx = (-this.pos.x + this.rayon) * dtS ; this.pos.x = this.rayon + dx + 4.7; this.vel.x *= -1;}
        if (this.pos.x>(simW - 9.1 - this.rayon)) { let dx = (simW - this.pos.x ) * dtS; this.pos.x = simW - this.rayon - dx  - 9.1; this.vel.x *= -1;}
        if (this.pos.y<(this.rayon+4)) { let dy = (-this.pos.y + this.rayon) * dtS ; this.pos.y = this.rayon  + 4 + dy; this.vel.y *= -1;}
        if (this.pos.y>(simH-this.rayon)) { let dy = (simH -this.pos.y ) * dtS ;this.pos.y = simH-this.rayon - dy; this.vel.y *= -1;}
    }


    checkCollision(p) {
        let dir = Vector2.sub(p.pos,this.pos);
        let d = dir.mag();

        let corr = this.rayon+p.rayon;
        if (d > corr) { 
            return;}
        else {
            corr = (corr - d) /2;
            if (d==0) return;
            dir.mult(1/d);
            this.pos.sub(dir,corr);
            p.pos.add(dir,corr);
            let v1 = Vector2.dot(this.vel,dir);
            let v2 = Vector2.dot(p.vel,dir);
            let m1 = this.masse;
            let m2 = p.masse;
            let newV1 = (m1*v1 + m2*v2 - m2*(v1-v2)*frein) / (m1+m2);
            let newV2 = (m1*v1 + m2*v2 - m1*(v2-v1)*frein) / (m1+m2);
            this.vel.add(dir,newV1-v1);
            p.vel.add(dir,newV2-v2);
        }
    }

    collision(voisins, particules) {
        for (let id of voisins) {
            let p = particules[id];
            if (p != this) {
                this.checkCollision(p);
            }
        }
    }

    update() {
        this.applyForce(gravite);
        this.vel.add(this.acc, dt);
        this.pos.add(this.vel, dt);
        this.acc.mult(0); 
    }
    updPos(dtS_) {
        this.applyForce(gravite);
        this.posPrev = this.pos.copy();
        this.vel.add(gravite, dtS_); // modif
        this.pos.add(this.vel, dtS_);
        // this.acc.mult(0); 
        // this.vel = Vector2.sub(this.pos,this.posPrev,1/dtS_);
        // this.vel.limit(8);
    }
    updVel(dtS_) {
        this.vel = Vector2.sub(this.pos,this.posPrev,1/dtS_);
        this.vel.limit(7);
    }

    show() {
        noStroke();
        fill(this.color);
        let x = cX(this.pos.x), y = cY(this.pos.y);
        circle(x, y, this.masse);
    }
}