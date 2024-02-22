const eC = {version: 'v0.01', release:'r0', date:'feb/24', owner: 'rky', code:'y2I', annee:'2024', maj:'feb/24'};

let app_json;
let menu;

let couleur = { Divers: '#E8F5E9', Animation:'#C8E6C9', Jeux:'#A5D6A7', PI:'#81C784', Neurone:'#66BB6A', Fractales:'#4CAF50'}; //43A047//388E3C//2E7D32//1B5E20
//B9F6CA//69F0AE//00E676//00C853
// let couleur = { Divers: '#137C8B', Animation:'#709CA7', Jeux:'#B8CBD0', PI:'#7A90A4', Neurone:'#344D59', Fractales:'#111'};
// let couleur = { Divers: '#ff0000', Animation:'#00ff00', Jeux:'#00ffff', PI:'#ff00ff', Neurone:'#ffff00', Fractales:'#0000ff'};

function preload() {
    app_json = loadJSON('./data/applis.json');  
}

function update(id) {
    let title = select("#title");
    title.html(app_json[id].title);
    let desc = select("#description");
    desc.html(app_json[id].description);
    let racc = select("#raccHREF");
    racc.attribute("href",app_json[id].href);
    let raccIMG = select("#raccIMG");
    raccIMG.attribute("src",app_json[id].src);
}

function btClick(event) {
    let id = event.srcElement.id;
    update(id);
}

function setup() {
    noCanvas()
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    menu = select("#menu")
    let nb = Object.keys(app_json).length;
    for (let n=0;n<nb;n++) {
        let t = app_json[n].title;
        let b = createButton(t);
        b.mouseClicked(btClick);
        b.id(n);
        b.style("background",couleur[app_json[n].category]);
        menu.child(b);
    }
    update(int(random(nb)));
}