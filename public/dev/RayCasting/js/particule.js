class Particule {
    constructor() {
        this.pos = createVector(width/4 , height /2);
        this.rays = [];
        this.heading=0;

        for (let i=-30 ; i<30 ; i +=1) {
            this.rays.push(new Ray(this.pos, radians(i)));
        }
    }

    rotate(angle_) {
        this.heading += angle_;
        for (let i=0 ; i<this.rays.length ; i +=1) {
            this.rays[i].setAngle(this.heading + radians(i-30));
        }
    }

    move(val_) {
        const vel = p5.Vector.fromAngle(this.heading);
        vel.setMag(val_);
        this.pos.add(vel);
    }

    update(x,y) {
        this.pos.x = x;
        this.pos.y = y;
    }

    lookAt(murs) {
        const scene = [];
        for (let ray of this.rays) {
            let dMin = Infinity;
            let ptMin = null;
            for (let mur of murs) {
                let point = ray.cast(mur);
                if (point) {
                    let d = p5.Vector.dist(this.pos, point);
                    if (d<dMin) { 
                        dMin = d ;
                        ptMin = point;
                    }
                }
            }
            if (ptMin) {
                stroke(255,70);
                circle(ptMin.x,ptMin.y,1);
                line(this.pos.x, this.pos.y, ptMin.x, ptMin.y);
                scene.push(dMin);
            } else {
                scene.push(Infinity);
            }
        }
        return scene;
    }

    show() {
        fill(255);
        circle(this.pos.x, this.pos.y,1);
        for (let ray of this.rays) {
            ray.show();
        }
    }
}