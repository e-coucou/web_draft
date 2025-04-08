const express = require("express");
const fs = require("fs");
const router = express.Router();
const { createCanvas } = require("canvas");

const { Polynome, logTable, createPoly } = require("./js/reed_salomon");
const { Encodeur, Binary } = require("./js/encodeur");
const { Grille } = require("./js/grille");

const quality = [{t:'L',i:[0,1],m:' (7%)'},{t:'M',i:[0,0],m:' (15%)'},{t:'Q',i:[1,1],m:' (25%)'},{t:'H',i:[1,0],m:(' (30%)')}];
const DIM = 3;

let qr_json, alphabet,loc_json, info_json;
let qrcode = [], qrinfo = [], grille;
let dim, code, image;
let version = 5, type='Q', level = 4, mode = 'B';
let message, message_l;


function loadData() {
    for (let i=0; i<Object.keys(qr_json).length;i++) {
        let m = qr_json[i];
        qrcode.push(m);
    }
    for (let i=0; i<Object.keys(info_json).length;i++) {
        let m = info_json[i];
        qrinfo.push(m);
    }
}
function newMessage(txt)  {
    message={bytes:[],txt:''};
    // let m_A = true;
    // mode='B';
    for (let c of txt) {
        let v = c.charCodeAt(0);
        message.bytes.push(v);
        message.txt+=c;
        if (alphabet[c] == undefined) m_A=false;
    }
    message_l = message.bytes.length;
    // if (m_A) mode='A';
    // if (Number(message.txt)){
    //     console.log('Numéric MODE available', message.txt);
    //     mode='N';
    // }
}
function encodeMess() {
    qrType = qrcode.filter(a => { return ( a.v == version && a.t==type)})[0];
    qrInfo = qrinfo.filter(a => { return ( a.type == type && a.level == level)})[0];

    code = new Encodeur(message, mode, version, message_l);
    code.setEC(qrType);
    code.encode();
    if (message_l >= qrType.d) console.log('ca va pas tenir ...');
    code.convertDec();
    code.errorCode();
}
function createQR(level_) {
    // init de la grille
    grille = new Grille(dim, version, loc_json[version]);
    let info = quality.find(a=>{return (a.t == type)}).i.slice(); // mode Q
    // console.log('xxxxxxxx',quality.find(a=>{return (a.t == type)}))
    mask_ = new Binary(level_,3); mask_.encode();
    let maskP = mask_.code;
    info.push(...maskP); // mask 0
    // finder patterns
    grille.addPatterns(0,0);
    grille.addPatterns(0,dim-7);
    grille.addPatterns(dim-7,0);
    // // separator
    grille.addSeparators(0,7,7,0);
    grille.addSeparators(0,dim-8,7,dim-8);
    grille.addSeparators(dim-8,7,dim-8,0);
    // // alignment pattern
    grille.addLocator();
    // // timing pattern
    grille.addTiming();
    // // dark module / reserved
    grille.addReserved();
    // // data bit
    grille.addData(level_, code.blockBin); // mask=0 - prevoir une boucle avec evalution
    grille.addString(info);
}
function createPNG(COLOR) {
    const width = (dim+2)*DIM;
    const height = (dim+2)*DIM;

    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    let base_color ='#000000';
    if (COLOR) {base_color = COLOR;}

    console.log(base_color);

//    context.fillStyle = "#764abc";
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);

// context.font = "bold 70pt 'PT Sans'";
// context.textAlign = "center";
// context.fillStyle = "#fff";

// Format the title and render to the canvas.
// const text = formatTitle(post.title);
// context.fillText(text[0], 600, titleY);
// If we need a second line, we move use the titleY and lineHeight
// to find the appropriate Y value.
// if (text[1]) context.fillText(text[1], 600, titleY + lineHeight);

        let color;

        for (let i=0; i<dim; i++) {
            for (let j=0; j<dim; j++) {
                color = base_color;
                switch(grille.grille[i][j]) {
                    case 1: color = '#ffffff'; break;
                    case -1: color = '#ff0000'; break;
                }
                context.fillStyle = color;
                context.fillRect((i+1)*DIM, (j+1)*DIM, DIM, DIM);
            }
        }

    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync("./public/images/image.png", buffer, { encoding: "utf8", flag: "w+" });
    return buffer;
}

router.get("/vcard", async (req,res) => {
    // await fs.readFile('./routes/api/QR-code/data/block.json', (err, data) => {
    //     if (err) { return res.status(500).send(err); }
    //     qr_json = data;
    //     return res.status(200).json(qr_json);
    // });

    const {nom, prenom, genre, email, adresse, mobile, site, titre, fonction, QUAL, COLOR, WEB} = req.query;

    let val = (`BEGIN:VCARD\nVERSION:4.0\nFN:${prenom}+${nom}\nN:${nom};${prenom};;${genre};\nEMAIL;TYPE=INTERNET:${email}\nTEL;TYPE=cell:${mobile}\nitem1.ADR:;${adresse}\nitem1.X-ABLabel:${site}\nitem2.URL:https://www.adisseo.com\nitem2.X-ABLabel:Web\nTITLE:${fonction}\nLANG:FR-fr
        ROLE:${titre}\nEND:VCARD\n`);
// TEL;TYPE=CELL:+33 6 2662 1093
// item1.ADR:;10 place du General de Gaulle;Immeuble Antony Parc II;ANTONY;;92160;FR;
// item1.X-ABLabel:HeadQuarter
// item2.URL:https://www.adisseo.com
// item2.X-ABLabel:Web
// TITLE:Purchasing Director Europe
// CATEGORIES:Purchasing;Director;Raw Materials;Methionine 
// GENDER:M
// LANG:FR-fr
// ROLE:Director
// ORG:Adisseo;Purchasing;Europe
// END:VCARD
// ‘
//    console.log(val);
    alphabet = JSON.parse(fs.readFileSync('./routes/api/QR-code/data/alpha.json', "utf8"));
    qr_json = JSON.parse(fs.readFileSync('./routes/api/QR-code/data/block.json', "utf8"));
    loc_json = JSON.parse(fs.readFileSync('./routes/api/QR-code/data/patterns.json', "utf8"));
    info_json = JSON.parse(fs.readFileSync('./routes/api/QR-code/data/information.json', "utf8"));

//    tpl = fs.readFileSync("./routes/api/QR-code/tpl/vcard.txt", "utf8");

//     let _texte = "http://draft.e-coucou.com";
    
    if (QUAL) {type = QUAL;}
    let _texte = val;
    newMessage(_texte);
    message_l = message.bytes.length;

    loadData();
    logTable();
    createPoly();
    // setOptions();
    // setVersion();
    let valide = qrcode.filter(a => { return (a.d > (message_l+1) && a.t==type); });
    version = valide[0].v;
    dim = ((version-1)*4) + 21;
    type = valide[0].t;
    encodeMess();
    // bestVersion();

    createQR(level);
    let img = createPNG(COLOR);

//    res.status(200).json(grille.grille);
    imageName = "image.png";
    if (WEB) {
        res.status(200).send(`<img src="../../images/${imageName}">`);
    } else {
        res.status(200).send(img);
    }

//    res.status(200).json({message: "fonctions API -> QR-CODE by eCoucou"}).json(qr_json);
})


module.exports = router;