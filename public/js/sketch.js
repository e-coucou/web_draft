const eC = {version: 'v0.01', release:'r0', date:'feb/24', owner: 'rky', code:'y2I', annee:'2024', maj:'feb/24'};

let app_json;
let menu;

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
        menu.child(b);
    }
    update(int(random(nb)));
}