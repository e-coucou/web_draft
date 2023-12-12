// Villes de France
const MIN_X= 100000, MAX_X = 1300000, MIN_Y=6001357, MAX_Y = 7191821;
let villes, dataJson,Annee;
let REDUC=800, RATIO=1.5;

class Annees {
    historique=[1968,1975,1982,1990,1999,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020];
    Amin = 1968;
    Amax = 2020;
    constructor() {
        this.Id=0;
        this.annee = 1968;
        this.iter=0;
    }

    setAnnee(a) {
        this.annee=a;
        // this.updateYear();
    }
}

function getCircle(v) {
    return max(1,Math.log(v/REDUC)*RATIO);
}

function searchVilles(v) {
    // console.log(this.value());
    searchInfo = '';
    v = v.toUpperCase();
    let filtre;
    // villes.forEach(a => { a.sel=0; a.couleur=(color(255))});
    if (v != '') {
        filtre = villes.filter(a =>  (a.city.toUpperCase().indexOf(v)>-1) );
        // filtre.forEach(a=>{a.sel=2 ; a.couleur= color(0,255,0)});
        // searchInfo = "#"+filtre.length;
        // console.log(filtre.length);
    }
    return filtre[0];
}

function drawMunipPrev(x1,x2,y1,y2) {
    let r = width/height;
    let offsetX = map((x2+x1)/2,x1,x2,0,width) / r;
    for (let i=0;i<villes.length;i++) {
        let v = villes[i];
        // if (v.x>x1 & v.x<x2 & v.y>y1 & v.y<y2) {
            let x = map(v.x,x1,x2,0,width) / r + width/2 - offsetX;
            // let x = map(v.x,x1,x2,0,width) + (width/2-offsetX/2)/2;
            let y = map(v.y,y1,y2,height,0);
            v['display'] = {x:x,y:y};
        // }
    }
}


function drawMunicipalite(x1,x2,y1,y2,ref) {
    noStroke();
    for (let i=0;i<villes.length;i++) {
        let v = villes[i];
        // fill(v.couleur);
        fill(100);
        if (v.x>x1 & v.x<x2 & v.y>y1 & v.y<y2) {
            let pop = v.hist[ref];
            let c = getCircle(pop);
            circle(v.display.x,v.display.y,c);
        }
    }
}