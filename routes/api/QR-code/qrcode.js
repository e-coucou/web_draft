const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const { createCanvas } = require("canvas");
const { Parser } = require('json2csv');

const { Polynome, logTable, createPoly } = require("./js/reed_salomon");
const { Encodeur, Binary } = require("./js/encodeur");
const { Grille } = require("./js/grille");
const { evaluate } = require("./js/penalites");

const {encrypt,decrypt,encryptToCompactJSON,decryptFromCompactJSON} = require("./js/crypto-aes");
const SECRET_KEY = process.env.SECRET_KEY;

// const {firebaseUpload} = require('./js/firebaseDB')
const database = require("./js/realtime");
const { console } = require("inspector");

const quality = [{t:'L',i:[0,1],m:' (7%)'},{t:'M',i:[0,0],m:' (15%)'},{t:'Q',i:[1,1],m:' (25%)'},{t:'H',i:[1,0],m:(' (30%)')}];
let DIM = 3;

let qr_json, alphabet,loc_json, info_json;
let qrcode = [], qrinfo = [], grille;
let dim, code;
let version = 5, type='Q', level = 4, mode = 'B', option=false;
let message, message_l;

function formatTimestamp(ts) {
  const date = new Date(Number(ts));
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(2);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
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
        if (tmp<best) { best = tmp; sel = i ;} 
    }
    return (sel);
}
function createPNG(base_color,contraste,standard) {
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
            if (contraste || standard) {
                color = base_color;
            } else {
                const r = Math.max(0,Math.min(255,coul.r));
                const g = Math.max(0,Math.min(255,coul.g));
                const b = Math.max(0,Math.min(255,coul.b));
                color = rgb2Hex(r,g,b);
            }
            switch(grille.grille[i][j]) {
                case 1: color = '#ffffff'; break;
                case -1: color = '#ff0000'; break;
            }
            context.fillStyle = color;
            context.strokeStyle =color;
            context.beginPath();
            if (standard) {a=0;b=0;c=0;d=0}
            context.roundRect((i+1)*(DIM), (j+1)*(DIM), DIM, DIM, [a,b,c,d]);
            context.stroke();
            context.fill();
        }
    }

    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync("./public/images/image.png", buffer, { encoding: "utf8", flag: "w+" });
    return Buffer.from(buffer,"base64");
}
function encodeQR(_texte, QUAL,PIXEL,LEVEL,CONTRASTE,STANDARD,COLOR) {
    alphabet = JSON.parse(fs.readFileSync('./routes/api/QR-code/data/alpha.json', "utf8"));
    qr_json = JSON.parse(fs.readFileSync('./routes/api/QR-code/data/block.json', "utf8"));
    loc_json = JSON.parse(fs.readFileSync('./routes/api/QR-code/data/patterns.json', "utf8"));
    info_json = JSON.parse(fs.readFileSync('./routes/api/QR-code/data/information.json', "utf8"));
    
    if (QUAL) {type = QUAL;}
    if (PIXEL) {DIM = PIXEL;}
    if (LEVEL && LEVEL>-1 && LEVEL<8)
        {option = false; level = Math.round(LEVEL);} else {option = true;}
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
    const image = createPNG(base_color,CONTRASTE&1,STANDARD&1);
    return [image, base_color];
}
async function logMetrics(source, type, level, qualite, version, option, _txt  ) {
    const cypher = encryptToCompactJSON(_txt,SECRET_KEY);
    const data = {
        type: type,
        level: level,
        version: version,
        qualite: qualite,
        option: option,
        time: new Date().getTime(),
        vcard: cypher
    }
    let ref = database.ref(source);
    ref.push(data)
    .then(()=> { console.log("Metrics Logged"); })
    .catch(err => {console.log(err); });
}
router.use(express.json());
router.get("/vcard", async (req,res) => {
    // On nettoye les 'undefined'
    const expected = ['nom', 'prenom', 'genre', 'email', 'adresse', 'mobile', 'site', 'titre', 'fonction', 'organisation', 'www', 'QUAL', 'COLOR', 'WEB', 'PIXEL', 'LEVEL', 'CONTRASTE', 'STANDARD'];
    expected.forEach( param => {
        if (req.query[param] === undefined || req.query[param] === null) {
            req.query[param] = ''; // Remplace undefined ou null par ''
        }
    });
    const {nom, prenom, genre, email, adresse, mobile, site, titre, fonction, organisation, www, QUAL, COLOR, WEB, PIXEL, LEVEL, CONTRASTE, STANDARD} = req.query;
    let _texte = (`BEGIN:VCARD\nVERSION:4.0\nFN:${prenom}+${nom}\nN:${nom};${prenom};;${genre};\nORG:${organisation}\nEMAIL;TYPE=INTERNET:${email}\nTEL;TYPE=cell:${mobile}\nitem1.ADR:;${adresse}\nitem1.X-ABLabel:${site}\nitem2.URL:${www}\nitem2.X-ABLabel:WWW\nTITLE:${fonction}\nLANG:FR-fr\nROLE:${titre}\nEND:VCARD\n`);

    const [image, base_color] = encodeQR(_texte, QUAL, PIXEL, LEVEL, CONTRASTE, STANDARD,COLOR);
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
    logMetrics("qrcode","vCard", level, type, version, option, _texte );
})
router.get("/info", async (req,res) => {
   res.status(200).json({
        api: "QR-Code",
        version: "1.1",
        auteur : "eCoucou",
        annee: 2025,
        documentation: "/api/qrcode/doc",
        QR_Code: {level: level, type: type, version: version, optimisation: option}}
    );
});
router.get("/doc", async (req,res) => {
   res.status(200).sendFile(path.join(__dirname,"/documentation_v2.html"));
//v0   res.status(200).sendFile(path.join(__dirname,"/documentation.html"));
//    res.status(200).send("<h1>API - QR-Code Documentation</h1><hr><div><a>/api/qrcode/vcard?</a><div>")
});
let dataArray;

router.get("/audit", async(req,res) => {
    const snapshot = await database.ref('qrcode').once('value');
    const allData = snapshot.val();

    // Filtrer uniquement les objets avec type == "vCard"
    const filtered = Object.entries(allData)
        .filter(([_, v]) => v.type === "vCard")
        .map(([id, v]) => ({ id, ...v }));
    dataArray = Object.entries(filtered).map(([id, item]) => ({ id,...item }));
    const formattedData = dataArray.map(item => ({
        ...item,
        timeFormatted: formatTimestamp(item.time),
        timeRaw: item.time,
        hasVCard: item.vcard && item.vcard.trim() !== ''
    }));
    const count = formattedData.length;
    res.render(path.join(__dirname,'./tpl/metrics_loop.ejs'), { data: formattedData });
});
router.get("/metrics", (req,res) => {
    res.render(path.join(__dirname,"./tpl/metrics_chart.html"));
});
router.get("/metrics_data", async(req,res) => {
    const snapshot = await database.ref('qrcode').once('value');
    const allData = snapshot.val();
    // const filtered = Object.entries(allData)
    //     .filter(([_, v]) => v.type === "vCard")
    //     .map(([id, v]) => ({ id, ...v }));
    const dataArray = Object.entries(allData).map(([id, item]) => ({ id,...item }));

    try {
        const grouped = dataArray.reduce((acc, log) => {
            const day = new Date(log.time).toISOString().split('T')[0];
            acc[day] = (acc[day] || 0) + 1;
            return acc;
        }, {});
        res.status(200).json(grouped);
    } catch (err) {
        res.status(500).json({code:err, error: 'Erreur API logs' });
    }
    // res.render(path.join(__dirname,'./tpl/metrics_loop.ejs'), { data: formattedData });
});
// Route pour exporter en CSV
router.get('/export', (req, res) => {
  // Données que tu veux exporter
  const dataToExport = dataArray;

  // Crée un objet Parser
  const json2csvParser = new Parser();
  const csv = json2csvParser.parse(dataToExport);

  // Envoie le fichier CSV en réponse
  res.header('Content-Type', 'text/csv');
  res.attachment('data_export.csv');
  res.send(csv);
});
router.get('/data', (req, res) => {
  const limit = 10; // Nombre d'éléments par bloc
  const startIndex = req.query.start || 0; // Commence à partir de l'index donné (par défaut 0)
  // Slice pour récupérer un "blocs" de données
  const max = Math.max(dataArray.length-1,startIndex+limit);
  const nextData = dataArray.slice(startIndex, max);
  res.json(nextData); // Envoie le "bloc" sous forme JSON
});
router.get('/cypher', (req,res) => {
    const mess = 'Mon message très secret';
    const cypher = encrypt(mess, SECRET_KEY);
    res.send(cypher);
});
router.get('/cypherjson', (req,res) => {
    const mess = 'Mon message très secret';
    const cypher = encryptToCompactJSON(mess, SECRET_KEY);
    res.send(cypher);
});
router.post('/decypherjson', (req,res) => {
    try {
        const {vcard} = req.body;
        if (!vcard) return res.status(400).send('Champ "encrypted" manquant');
        const plaintext = decryptFromCompactJSON(vcard,SECRET_KEY);
        res.send(`<html><body><h1>Texte déchiffré :</h1><p>${plaintext}</p></body></html>`);
    } catch (err) {
        res.status(500).send('Erreur de déchiffrement : ' + err.message);
    }
});

//-- Export module et fonctions
module.exports = router;