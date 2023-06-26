class Particule {
    constructor() {
        this.pos = createVector(width/2 , height /2);
        this.rays = [];
        this.intersections = [];

        // for (let i=0 ; i<360 ; i +=10) {
        //     this.rays.push(new Ray(this.pos, radians(i)));
        // }
    }

    update(x,y) {
        this.pos.x = x;
        this.pos.y = y;
    }

    lookAt(murs, points) {
        // for (let ray of this.rays) {
        this.intersections = [];
        this.rays = [];
        for (let pt of points) {
            const dir= createVector(-this.pos.x+pt.x, -this.pos.y+pt.y);
            const angle = dir.heading();
            // console.log(angle);
            // let ray = new Ray(this.pos, angle);
            this.intersections.push(new Ray(this.pos, angle));
            this.intersections.push(new Ray(this.pos, angle-0.01));
            this.intersections.push(new Ray(this.pos, angle+0.01));
        }
        for (ray of this.intersections) {
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
                this.rays.push(new Ray(ptMin , ray.angle));
                // stroke(255,70);
                // circle(ptMin.x,ptMin.y,4);
                // line(this.pos.x, this.pos.y, ptMin.x, ptMin.y);
            }
        }
    }

    showDot() {
        fill(255,0,0,255);
        circle(this.pos.x, this.pos.y,4);
    }

    show() {
        
        this.rays.sort((a,b) => { return a.angle - b.angle; });
        let n = this.rays.length;
        let i=0;
        fill(0, 0, 0, 70);
        stroke(255, 255, 255, 10);
        strokeWeight(1);
        beginShape();
            // vertex(this.pos.x, this.pos.y);
            for (let ray of this.rays) {
                // stroke(360*i/n, 255, 255);
                // circle(ray.pos.x,ray.pos.y,2);
                vertex(ray.pos.x, ray.pos.y);
                // line(this.pos.x, this.pos.y, ray.pos.x, ray.pos.y);
                // ray.show();
                i++;
            }
            vertex(this.rays[0].pos.x, this.rays[0].pos.y);
            // vertex(this.pos.x, this.pos.y);
        endShape(CLOSE);
    }

    lineShow(points) {
        fill(255);
        // push();
        stroke(255,0,0);
        circle(this.pos.x, this.pos.y,1);
        // translate(this.pos.x,this.pos.y);
        for (let pt of points) {
            line(this.pos.x,this.pos.y,pt.x, pt.y);
        }
        // pop();
    }
}