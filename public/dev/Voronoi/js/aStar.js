class Astar {
    constructor(start,end) {
        this.start = start;
        this.end = end;
        this.openSet = [];
        this.closeSet = [];
        this.openSet.push(start);
        this.path = [];
    }

    remove(cur) {
        for (let i =this.openSet.length-1; i>=0 ; i--) {
            if (this.openSet[i] === cur) {
                this.openSet.splice(i, 1);
            }
        }
    }
    heuristic(c,e) {
        // console.log(c,e)
        return dist(c.x,c.y,e.x,e.y);
        // return dist(c.c,c.l,e.c,e.l);
        // return ( Math.abs(c.l-e.l) + Math.abs(c.c-e.c))
    }
    findPath(current) {
        // trace le chemin
        this.path = [];
        let tmp = current;
        while (tmp.precedent) {
            this.path.push(tmp);
            tmp = tmp.precedent;
        }
    }
    next() {
        let mini = Infinity, current;
        for (let c of this.openSet) {
            if (c.f < mini) {
                mini = c.f;
                current = c;
            }
        }
        // console.log(current)
        if (current === this.end) {
            this.findPath(this.end);
            this.path.push(this.start);
            console.log('FIN')
            return true;
        }
        this.remove(current);
        this.closeSet.push(current);
        for (let vPt of current.voisins) {
            let v = vPt.parent;
            if ( !this.closeSet.includes(v) ) {
                // let tmpG = current.g + Math.sqrt(Math.abs(current.c-v.c) + Math.abs(current.l-v.l));//1;
                let tmpG = current.g + dist(current.x,current.y,v.x,v.y);//1;
                let newP = false;
                if (this.openSet.includes(v)) {
                     if (tmpG < v.g) {
                         v.g = tmpG;
                         newP = true;
                     }
                } else {
                    v.g = tmpG;
                    this.openSet.push(v);
                    newP = true;
                }
                if (newP) {
                    v.h = this.heuristic(v,this.end); 
                    v.f = v.g + v.h;
                    v.precedent = current;
                }
            }
        }
        this.findPath(current);
        return false;
    }
    show(cO = color(0,255,0),cC = color(255,0,0)) {
        for (let cell of this.openSet) {
            fill(color(255)); noStroke();
            circle(cell.display.x, cell.display.y, 2);
        }
        for (let cell of this.closeSet) {
            fill(color(255,135)); noStroke();
            circle(cell.display.x, cell.display.y, 2);
        }
        noFill(); stroke(cVert); strokeWeight(3);
        beginShape();
        for (let cell of this.path) {
            // cell.show(color(255,255,255));
            vertex(cell.display.x , cell.display.y );
        }
        endShape();
    }
}