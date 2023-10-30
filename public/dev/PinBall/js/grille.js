const cellOffset = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,0],[0,1],[1,-1],[1,0],[1,1]];
const primeA = 25253, primeB = 161957;

class Entry {
    constructor(id, key) {
        this.id=id;
        this.key = key;
    }

}
class Grille {
    constructor(s_) {
        this.step = s_;
        this.h = round(simH/s_);
        this.w = round(simW/s_);
        this.l = this.h * this.w
        this.lookup = [];
        this.startId = [];
    }
    getCell(pos, rayon) {
        return [int((pos.x+1) / rayon), int((pos.y+1)/rayon)];
    }

    toHash(c,l,n) {
        const key =  (c*primeA + l*primeB);
        return key%n;
    }
    initLookup(particules) {
        const nb = particules.length;
        this.lookup = [];
        this.startId = [];
        for (let i=0; i<nb ;i++ ) {
            const [cellX, cellY] = this.getCell(particules[i].pos,this.step);
            const cellKey = this.toHash(cellX, cellY,nb);
            this.lookup.push(new Entry(i, cellKey));
            this.startId.push(Infinity);
        }

        this.lookup.sort((a,b)=> { return (a.key - b.key);})
        
        let key, keyPrev;
        for (let i=0; i< nb; i++) {
            key = this.lookup[i].key;
            keyPrev = (i==0)?(Infinity):(this.lookup[i-1].key);
            if (key != keyPrev) this.startId[key]=i;
        }
    }
    lookupPoint(cible, particules) {
        let voisins = [], possibles = [];
        let [centreX, centreY] = this.getCell(cible,this.step);
        const nb = particules.length;
        for (let [c,l] of cellOffset) {
            let key = this.toHash(c+centreX, l+centreY, nb);
            let cellId = this.startId[key];
            for (let id = cellId; id<nb ; id++) {
                if (this.lookup[id].key != key) break;
                let partId = this.lookup[id].id;
                // particules[partId].color=color(0,255,0);
                possibles.push(partId);
                let dst = Vector2.sub(particules[partId].pos , cible).mag();
                if (dst<=this.step) {
                    voisins.push(partId);
                }
            }
        }
        return [voisins, possibles];
    }
    getMouse() {
        const x = invX(mouseX);
        const y = invY(mouseY);
        return( new Vector2(x,y));
    }
    show(particules=[]) {
        noFill();
        strokeWeight(1);
        stroke(color(200,200,0,120));
        const y0 = cY(0);
        const y1 = cY(simH); 
        const x0 = cX(0);
        const x1 = cX(simW);
        for (let c=0; c<this.w; c++) {
            let x = cX(c*this.step);
            line(x,y0,x,y1);
        }
        for (let l=0; l<this.h; l++) {
            let y = cY(l*this.step);
            line(x0,y,x1,y);
        }
        const colX = round(invX(mouseX)/this.step - this.step/2)-1;
        const ligY = round(invY(mouseY)/this.step + this.step/2)+1;
        stroke(color(200,200,0,255));
        strokeWeight(4);
        rect(cX(colX*this.step),cY(ligY*this.step),3*cX(this.step),3*cX(this.step));

        if (particules.length > 0) {
            const mouse_ = this.getMouse();
            let [voisins, possibles] = this.lookupPoint(mouse_, particules);
            for (let id of possibles) {
                particules[id].color=color(0,255,0);
            }
            for (let id of voisins) {
                particules[id].color=color(255,255,0);
            }
        }
    }
}