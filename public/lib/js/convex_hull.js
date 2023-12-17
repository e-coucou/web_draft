class Convex {
    constructor() {
        this.data = [];
        this.Nord = [];
        this.Sud  = [];
        this.hull = [];
    }
    add(x,y) {
        let v = new Vector(x,y,0);
        this.data.push(v);
    }
    init() {
        this.data.sort((a,b) => { return (a.e[0]-b.e[0]);} );
        let y = this.data[0].y(); 
        // on separe le nord et le sud. Attention l'axe des Y a la tete en bas !
        this.Nord = this.data.filter( a => { return (a.y()<=y);});
        this.Sud = this.data.filter( a => { return (a.y()>=y);});
        // Pour le sud on revient dans l'autre sens de la droite vers la gauche : x décroissants.
        this.Sud.sort((a,b) => {return (b.e[0]-a.e[0]);});
        this.hull.push(this.Nord[0]);
        this.hull.push(this.Nord[1]);
        this.Nord.splice(0,2);
    }
    nextHull(s=0) {
        let w;
        if (s==0) {
            w =this.Nord[0];
        } else {
            w = this.Sud[0];
        }
        let u = this.hull[this.hull.length-2];
        let v = this.hull[this.hull.length-1];
        if (s==0) {
            this.Nord.splice(0,1);
        } else {
            this.Sud.splice(0,1);
        }
        let i = Vector.cross(u,v,w);
        while (i<=0 && this.hull.length>2) {
            this.hull.pop();
            v = this.hull[this.hull.length-1];
            u = this.hull[this.hull.length-2];
                i = Vector.cross(u,v,w);
        }
        this.hull.push(w);
    }

    iter(n) {
        for (let i =0; i<n;i++) {
        if (this.Nord.length>0) {
                this.nextHull(0);
            } else {
                if (this.Sud.length>0) {
                    this.nextHull(1);
                }
            }
        }
    }

    solve() {
        while (this.Sud.length>0) {
            if (this.Nord.length>0) {
                this.nextHull(0);
            } else {
                if (this.Sud.length>0) {
                    this.nextHull(1);
                }
            }
        }
    }

    showPt() {
        fill(255); noStroke();
        for (let v of this.data) {
            circle(v.x(),v.y(),2);
        }
        fill(255,0,0); noStroke();
        for (let v of this.Nord) {
            circle(v.x(),v.y(),4);
        }
        fill(0,0,255); noStroke();
        for (let v of this.Sud) {
            circle(v.x(),v.y(),4);
        }
        fill(0,255,0); noStroke();
        circle(this.data[0].x(),this.data[0].y(),5);
    }

    trace() {
        stroke(0,255,0);strokeWeight(2);
        for (let i=0;i<this.hull.length-1;i++) {
            line(this.hull[i].x(),this.hull[i].y(), this.hull[i+1].x(), this.hull[i+1].y());
            circle(this.hull[i+1].x(),this.hull[i+1].y(),5);
        }        
    }
}