class Cell {
    constructor(c,l,s) {
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.c = c;
        this.l = l;
        this.x = c*s;
        this.y = l*s;
        this.w = s;
        this.voisins = [];
        this.precedent = undefined;
        this.wall = false;
        if (random()<0.5) {
            this.wall = true;
        }
    }

    resize(s) {
        this.x = this.c*s+s;
        this.y = this.l*s+s;
        this.w = s;
    }
    voisin(g) {
        if (this.c < cols-1) {
            this.voisins.push(g[this.c+1][this.l]);
        }
        if (this.l < rows-1) {
            this.voisins.push(g[this.c][this.l+1]);
        }
        if (this.c > 0) {
            this.voisins.push(g[this.c-1][this.l]);
        }
        if (this.l > 0) {
            this.voisins.push(g[this.c][this.l-1]);
        }
        if (this.l > 0 && this.c > 0) {
            this.voisins.push(g[this.c-1][this.l-1]);
        }
        if (this.l > 0 && this.c < cols-1) {
            this.voisins.push(g[this.c+1][this.l-1]);
        }
        if (this.c > 0 && this.l < rows-1) {
            this.voisins.push(g[this.c-1][this.l+1]);
        }
        if (this.c < cols-1 && this.l < rows-1) {
            this.voisins.push(g[this.c+1][this.l+1]);
        }
    }

    show(c = color(120,120,120)) {
        fill(c);
        if (this.wall)  {
            fill(0);
        // stroke(0),strokeWeight(2);
        // rect(this.x,this.y,this.w,this.w);
        circle(this.x+this.w/2, this.y+this.w/2,2*this.w/3);
        }
    }
}

class Astar {
    constructor(start,end) {
        this.start = start;
        this.end = end;
        this.openSet = [];
        this.closeSet = [];
        this.openSet.push(start);
        this.path = [];
        this.end.wall = false;
        this.start.wall = false;
    }

    remove(cur) {
        for (let i =this.openSet.length-1; i>=0 ; i--) {
            if (this.openSet[i] === cur) {
                this.openSet.splice(i, 1);
            }
        }
    }
    heuristic(c,e) {
        // return dist(c.x,c.y,e.x,e.y);
        return dist(c.c,c.l,e.c,e.l);
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
        if (current === this.end) {
            this.findPath(this.end);
            this.path.push(this.start);
            console.log('FIN')
            return true;
        }
        this.remove(current);
        this.closeSet.push(current);
        for (let v of current.voisins) {
            if ( !this.closeSet.includes(v) && !v.wall) {
                let tmpG = current.g + Math.sqrt(Math.abs(current.c-v.c) + Math.abs(current.l-v.l));//1;
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
            cell.show(cO);
        }
        for (let cell of this.closeSet) {
            cell.show(cC);
        }
        noFill(); stroke(cVert); strokeWeight(5);
        beginShape();
        for (let cell of this.path) {
            // cell.show(color(255,255,255));
            vertex(cell.x + cell.w/2, cell.y + cell.w/2);
        }
        endShape();
    }
}