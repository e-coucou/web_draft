class CercleCirc {
    constructor() {
        this.points = [];
        this.cpt = 0;
    }

    add(x,y) {
        switch (this.cpt) {
            case 1:
            case 0: this.points.push(new Vector(x,y,0));
                    this.cpt++;
                    break;
            case 2: this.points.splice(0,1);
                    this.points.push(new Vector(x,y,0));
                    break;
        }
    }

    centre(x,y) {
        let A =  [this.points[0].x(), this.points[0].y(), 1];
        let B =  [this.points[1].x(), this.points[1].y(), 1];
        let C =  [x,y, 1];
        let S = 2*det(A,B,C);
        let a2 = this.points[0].x() * this.points[0].x() + this.points[0].y() * this.points[0].y();
        let b2 = this.points[1].x() * this.points[1].x() + this.points[1].y() * this.points[1].y();
        let A2 = [a2,this.points[0].y(),1];
        let B2 = [b2,this.points[1].y(),1];
        let C2 = [x*x+y*y,y,1];
        let A3 = [a2,this.points[0].x(),1];
        let B3 = [b2,this.points[1].x(),1];
        let C3 = [x*x+y*y,x,1];
        let x0 = 1/S*det(A2,B2,C2);
        let y0 = -1/S*det(A3,B3,C3);
        let Centre = new Vector(x0,y0,0);
        let r = Vector.dist(Vector.sub(Centre,this.points[0]));
        // let d1 = Vector.dist(Vector.sub(Centre,this.points[1]));
        return [x0,y0,r];
    }

    show() {
        fill(255);
        noStroke();
        for (let p of this.points) {
            circle(p.x(),p.y(),3);
        }
    }

    draw(x,y) {
        this.show();
        fill(0,255,255); noStroke();
        circle(x,y,5);

        if (this.points.length==2) {
            stroke(255,120);
            setLineDash([5, 10, 30, 10]);
            let [x0,y0,r] = this.centre(x,y);
            line(x0,offset,x0,height-offset);
            line(offset,y0,width-offset,y0);
            noFill();
            setLineDash([1]);
            stroke(255,0,255,200);
            circle(x0,y0,2*r);
            stroke(255,255,0,80);
            line(x,y,this.points[0].x(),this.points[0].y());
            line(x,y,this.points[1].x(),this.points[1].y());
            line(this.points[0].x(),this.points[0].y(),this.points[1].x(),this.points[1].y());
        }
    }

}

function setLineDash(list) {
    drawingContext.setLineDash(list);
}

function det(A,B,C) {
    let [a,b,c] = A;
    let [d,e,f] = B;
    let [g,h,i] = C;
    let D = a*e*i + b*f*g + c*d*h - a*f*h - b*d*i - c*e*g;
    return D;
}