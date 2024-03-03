const eC = {version: 'v0.1', release:'r0', date:'feb/24', owner: 'rky', code:'y2I', annee:'2024', maj:'mar/24'};

let app_json;
let menu;
let selectID;

let icons = { Divers: '🐣', Animation:'📽️', Jeux:'🛝', PI:'𝛑', Neurone:'🔂', Fractales:'☸️', Particules:'🌐', Data:'📈', Mathematiques:'⌨️', Neige:'❅',Algorithmes:'〄'}; //E8F5E9//C8E6C9//A5D6A7//43A047//388E3C//2E7D32//1B5E20
//B9F6CA//69F0AE//00E676//00C853
// let couleur = { Divers: '#137C8B', Animation:'#709CA7', Jeux:'#B8CBD0', PI:'#7A90A4', Neurone:'#344D59', Fractales:'#111'};
// let couleur = { Divers: '#ff0000', Animation:'#00ff00', Jeux:'#00ffff', PI:'#ff00ff', Neurone:'#ffff00', Fractales:'#0000ff'};

function preload() {
    app_json = loadJSON('./data/applis.json');  
}

function update(id) {
    let bt = selectAll("button");
    bt.forEach(btn => { 
        if (btn.id() == id) {
            btn.class('Section-menu--button-sel');
        } else {
            btn.class('Section-menu--button');
        }
    });
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
    console.log(event.srcElement)
    let id = event.srcElement.id;
    update(id);
}

function setup() {
    noCanvas()
	console.log("%c (ツ) # eCoucou "+eC.version+" # ","background: #f00; color: #fff");
    menu = select("#menu");
    let nb = Object.keys(app_json).length;
    for (let n=0;n<nb;n++) {
        let t = app_json[n].title;
        let b = createButton('');
        let spanIcon = createElement('span',icons[app_json[n].category]);
        let spanTitre = createElement('span',t);
        b.mouseClicked(btClick);
        b.id(n);
        spanIcon.id(n);
        spanTitre.id(n);
        // b.style("background-color",couleur[app_json[n].category]);
        // b.class([app_json[n].category]);
        b.class('Section-menu--button');
        spanIcon.class('Section-menu--Icon');
        spanTitre.class('Section-menu--Titre');
        // b.attribute('value','selected');
        menu.child(b);
        b.child(spanIcon);
        b.child(spanTitre);
    }
    selectID = int(random(nb));
    update(selectID);
}