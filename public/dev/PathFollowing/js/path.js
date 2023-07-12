class Path {
    constructor() {
        this.path = [];
        this.rayon = 30;
    }

    add(pt_) {
        this.path.push(pt_);
    }

    show() {
        let q;
        for (let i=0; i < this.path.length-1; i++) {
            let p = this.path[i];
            q = this.path[i+1];
            stroke(255);
            strokeWeight(1);
            line(p.x,p.y,q.x,q.y);
            stroke(120,100);
            strokeWeight(this.rayon);
            line(p.x,p.y,q.x,q.y);
            }
        line(q.x,q.y,this.path[0].x, this.path[0].y);
        stroke(255);
        strokeWeight(1);
        line(q.x,q.y,this.path[0].x, this.path[0].y);
}
}