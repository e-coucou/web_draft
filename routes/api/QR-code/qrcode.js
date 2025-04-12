const express = require("express");
const fs = require("fs");
const router = express.Router();
const { createCanvas } = require("canvas");

const { Polynome, logTable, createPoly } = require("./js/reed_salomon");
const { Encodeur, Binary } = require("./js/encodeur");
const { Grille } = require("./js/grille");
const { evaluate } = require("./js/penalites");

const quality = [{t:'L',i:[0,1],m:' (7%)'},{t:'M',i:[0,0],m:' (15%)'},{t:'Q',i:[1,1],m:' (25%)'},{t:'H',i:[1,0],m:(' (30%)')}];
let DIM = 3;

let qr_json, alphabet,loc_json, info_json;
let qrcode = [], qrinfo = [], grille;
let dim, code, image;
let version = 5, type='Q', level = 4, mode = 'B', option=false;
let message, message_l;

function hex2Rgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgb2Hex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
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
function optimise() {
    let best =Infinity,sel=0;
    for (let i=0;i<8;i++) {
        createQR(i);
        let tmp = evaluate(grille.grille,grille.dim);
        // console.log(i,tmp,best);
        if (tmp<best) { best = tmp; sel = i ;} 
    }
    return (sel);
}
function createPNG(base_color) {
    const width = (dim+2)*DIM;
    const height = (dim+2)*DIM;

    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

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
        let a,b,c,d,g;

        for (let i=0; i<dim; i++) {
            for (let j=0; j<dim; j++) {
                a=Math.floor(Math.random()*10); b=Math.floor(Math.random()*10); c= Math.floor(Math.random()*10); d=Math.floor(Math.random()*10);
                g=Math.floor(Math.random()*5+1);
                let cRGB = hex2Rgb(base_color);
                let coul = { r:Math.trunc(cRGB.r+g*((a>d)?a:-a)), g:Math.trunc(cRGB.g+g*((b>d)?b:-b)), b: Math.trunc(cRGB.b+g*((c>d)?c:-c)) };
                color = rgb2Hex(coul.r,coul.g,coul.b);
                switch(grille.grille[i][j]) {
                    case 1: color = '#ffffff'; break;
                    case -1: color = '#ff0000'; break;
                }
                context.fillStyle = color;
               context.strokeStyle =color;
                context.beginPath();
                context.roundRect((i+1)*(DIM), (j+1)*(DIM), DIM, DIM, [a,b,c,d]);
             context.stroke();
                context.fill();
            }
        }

    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync("./public/images/image.png", buffer, { encoding: "utf8", flag: "w+" });
    return Buffer.from(buffer,"base64");
}
router.get("/vcard", async (req,res) => {

    const {nom, prenom, genre, email, adresse, mobile, site, titre, fonction, organisation, QUAL, COLOR, WEB, PIXEL, LEVEL} = req.query;

    let _texte = (`BEGIN:VCARD\nVERSION:4.0\nFN:${prenom}+${nom}\nN:${nom};${prenom};;${genre};\nORG:${organisation}\nEMAIL;TYPE=INTERNET:${email}\nTEL;TYPE=cell:${mobile}\nitem1.ADR:;${adresse}\nitem1.X-ABLabel:${site}\nitem2.URL:https://www.adisseo.com\nitem2.X-ABLabel:Web\nTITLE:${fonction}\nLANG:FR-fr
        ROLE:${titre}\nEND:VCARD\n`);

    alphabet = JSON.parse(fs.readFileSync('./routes/api/QR-code/data/alpha.json', "utf8"));
    qr_json = JSON.parse(fs.readFileSync('./routes/api/QR-code/data/block.json', "utf8"));
    loc_json = JSON.parse(fs.readFileSync('./routes/api/QR-code/data/patterns.json', "utf8"));
    info_json = JSON.parse(fs.readFileSync('./routes/api/QR-code/data/information.json', "utf8"));
    
    if (QUAL) {type = QUAL;}
    if (PIXEL) {DIM = PIXEL;}
    if (LEVEL && LEVEL>-1 && LEVEL<8)
        {option = false; level = Math.round(LEVEL);}
    let base_color ='#000000';
    if (COLOR) {base_color = COLOR;}

    newMessage(_texte);
    message_l = message.bytes.length;
    loadData();
    logTable();
    createPoly();
    let valide = qrcode.filter(a => { return (a.d > (message_l+1) && a.t==type); });
    version = valide[0].v;
    dim = ((version-1)*4) + 21;
    type = valide[0].t;
    encodeMess();

    if (!option) {
        createQR(level);
    } else {
        level = optimise();
        createQR(level);
    }
    image = createPNG(base_color);
    imageName = "image.png";
    if (WEB) {
        if (WEB==1) {
            res.writeHead(200, {"Content-Type": "image/png", "Content-Length" : image.length });
            res.end(image);
        } else {
            res.status(200).send(`<H3 style="color: ${base_color}">Voici votre QR-Code</H3><p>Optimisation Level [${level}]</p><hr><img style="height: 60%" src="../../images/${imageName}"><br><p>by eCoucou 2025</p>`);
        }
    } else {
        res.status(200).send(image);
    }

//    res.status(200).json({message: "fonctions API -> QR-CODE by eCoucou"}).json(qr_json);
})

router.get("/info", async (req,res) => {
   res.status(200).json({
        api: "QR-Code",
        version: "1.0",
        auteur : "eCoucou",
        annee: 2025,
        QR_Code: {level: level, type: type, version: version, optimisation: option}}
    );
});


module.exports = router;