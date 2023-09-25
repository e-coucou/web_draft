const eC = {version: 'v0.1', release:'r0', date:'sep/23', owner: 'rky', code:'y2H', annee:'2023'};
let matieres=[], m_json, zc_json;

function preload() {
    m_json = loadJSON('./data/matieres.json')
    zc_json = loadJSON('./data/zc310.json')
}

function windowResized() {
    let h_ = innerHeight*0.98;
    let w_ = min(0.59*h_, innerWidth);
    resizeCanvas(w_,h_);
    let x_ = (windowWidth - width) / 2;
    let y_ = (windowHeight - height) / 2;
    select('canvas').position(x_, y_+10);
}
function loadData() {
    for (let i=0; i<Object.keys(zc_json).length;i++) {
        let m = zc_json[i];
        addMatiere(m,true);
        addMatiere(m,false);
    }
}
function setup() {
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    let h_ = innerHeight*0.98;
    let w_ = min(0.59*h_, innerWidth);
    canvas = createCanvas(w_,h_); // mise en place du ratio 0.59
    canvas.parent("#canvas");
    let x = (windowWidth - width) / 2;
    let y = (windowHeight - height) / 2;
    canvas.position(x, y+10);

    loadData();
  
    windowResized();
}


function draw() {
    background(51);
    for (let i=0; i<Object.keys(m_json).length;i++) {
        m = m_json[i];
        textAlign(LEFT,CENTER);
        textSize(14);
        fill(230,200,240);
        text(m.nom,100,100+25*i);
    }

}