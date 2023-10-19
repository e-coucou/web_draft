let grilleLookup = [];
let startId = [];

const cellOffset = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,0],[0,1],[1,-1],[1,0],[1,1]];

function getCell(pos, rayon) {
    return [int((pos.x+1) / rayon/2), int((pos.y+1)/rayon/2)];
}

function getHash(c,l,n) {
    const primeA = 587, primeB = 2237;
    const key =  (c*primeA + l*primeB);
    return key%n;
}
function grilleRecherche() {
    const nb = particules.length;
    grilleLookup = [];
    startId = [];
    for (let i=0; i<nb ;i++ ) {
        const [cellX, cellY] = getCell(particules[i].pos,blurRadius/2);
        const cellKey = getHash(cellX, cellY,nb);
        grilleLookup.push(new Entry(i, cellKey));
        startId.push(Infinity);
    }

    grilleLookup.sort((a,b)=> { return (a.key - b.key);})
    
    let key, keyPrev;
    for (let i=0; i< nb; i++) {
        key = grilleLookup[i].key;
        keyPrev = (i==0)?(Infinity):(grilleLookup[i-1].key);
        if (key != keyPrev) startId[key]=i;
    }
}

function recherchePoint(t,rayon) {
    let [centreX, centreY] = getCell(t,rayon);
    const nb = particules.length;
    const Rsqr = rayon*rayon;
    for (let [c,l] of cellOffset) {
        let key = getHash(c+centreX, l+centreY, nb);
        let cellId = startId[key];
        for (let id = cellId; id<nb ; id++) {
            if (grilleLookup[id].key != key) break;
            let partId = grilleLookup[id].id;
            particules[partId].color=color(0,255,0);
            let dst = particules[partId].pos.dist(t);
            if (dst<=rayon) {
                particules[partId].color=color(255,255,0);
            }
        }
    }
}

class Entry {
    constructor(id, key) {
        this.id=id;
        this.key = key;
    }
}