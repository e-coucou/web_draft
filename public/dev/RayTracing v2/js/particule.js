class Particule {
    constructor() {
        this.pos = createVector(width/2 , height /2);
        this.rays = [];

        for (let i=0 ; i<360 ; i +=1) {
            this.rays.push(new Ray(this.pos, radians(i)));
        }
    }

    update(x,y) {
        this.pos.x = x;
        this.pos.y = y;
    }

    lookAt(murs) {
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
            }
        }
    }

    show() {
        fill(255);
        circle(this.pos.x, this.pos.y,1);
        for (let ray of this.rays) {
            ray.show();
        }
    }
}