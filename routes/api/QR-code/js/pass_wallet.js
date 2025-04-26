const {eCoucou, Terms} = require("./info");

const { PKPass } = require('passkit-generator');
const fs = require('fs');
const path = require('path');
const pass_tpl = require("./pass_template");
const { v4: uuidv4 } = require('uuid');
const { createCanvas } = require("canvas");

// --- Configuration Essentielle (les certifcats/les clés) ---
const CERT_FOLDER = path.join('./routes/api/QR-code/', 'certs'); // Dossier où sont stockés les certificats
const signerCert = path.join(CERT_FOLDER, 'signerCert.pem');
const signerKey = path.join(CERT_FOLDER, 'signerKey.pem');
const WWDR = path.join(CERT_FOLDER, 'wwdr.pem');
const signerKeyPassphrase = process.env.KEYPASSPHRASE; // Mot de passe du fichier .p12
// Charger les certificats
const certs = {
    wwdr: fs.readFileSync(WWDR),
    signerCert: fs.readFileSync(signerCert),
    signerKey: fs.readFileSync(signerKey),
    signerKeyPassphrase: signerKeyPassphrase,
};
function addCert() { return certs ; };
function addBack_id(id) { 
    const b_id = {
            key : "IDvCard",
            label : "vCardID",
            value : id
        };
    return b_id ;
}
function addBack_www() {
    const info = {
        key : "website",
        label : "Suivez moi",
        value : "http://draf.e-coucou.com"
    };
    return info;
}
function addBack_copyright() {
    const info = {
        key : "copyright",
        label : "Copyright",
        value : "(c) eCoucou - Lyon 2025"
    };
    return info;
}
function addBack_terms() {
    const info = {
        key : "terms",
        label : "Terms and Conditions",
        // value : "MIT License\n\nVous pouvez utilisez ce badge, les informations qu'il contient sont de votre propre responsabilité.\n\n."
        value : Terms()
    };
    return info;
}
function drawStrip(couleur) {
    const width = 375;
    const height = 123;
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");
    context.fillStyle = couleur;
    context.fillRect(0, 0, width, height);
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync("./routes/api/QR-code/assets.pass/strip.png", buffer, { encoding: "utf8", flag: "w+" });
}
function addField(key,label,value,align="PKTextAlignmentCenter") {
    const info = {
        key: key,
        label: label,
        value: value,
        textAlignment: align,
    };
    return info;
}
async function getPassWallet(vcardData, nom, societe, prenom, www, mobile, fonction, couleur) {
    function addProps() {return passData ; };
    const vCardID = uuidv4();
    drawStrip(couleur);
    const passData = {
        ...pass_tpl, // Copie les valeurs par défaut du template
        backgroundColor: couleur,
        teamIdentifier: process.env.ID_TEAM_APPLE,
        serialNumber: vCardID, // Génère un ID unique
    };
    const pass = await PKPass.from(
      {
        model: path.join('./routes/api/QR-code/assets'),
        certificates: addCert() 
      },
      addProps(),
    );
    pass.type = "generic";
    pass.setBarcodes({message:vcardData,format:"PKBarcodeFormatQR"});
    pass.headerFields.push(addField('1','rev.',eCoucou().version));
    pass.primaryFields.push(addField('p1',societe,(prenom+' '+nom),"PKTextAlignmentLeft"));
    pass.secondaryFields.push(addField('s1',fonction,mobile,"PKTextAlignmentLeft"));
    pass.secondaryFields.push(addField('s2',"",www,"PKTextAlignmentLeft"));
    pass.auxiliaryFields.push(addField('a1','by eCoucou',"","PKTextAlignmentLeft"));
    pass.backFields.push(addBack_id(vCardID));
    pass.backFields.push(addBack_www());
    pass.backFields.push(addBack_copyright());
    pass.backFields.push(addBack_terms());
    const buffer = pass.getAsBuffer();
    return buffer;
}
async function getBarreCode(nom, code,couleur,type) {
    function addProps() {return passData ; };
    const vCardID = uuidv4();
    drawStrip(couleur);
    const passData = {
        ...pass_tpl, // Copie les valeurs par défaut du template
        logoText: "018137",
        backgroundColor: couleur,
        teamIdentifier: process.env.ID_TEAM_APPLE,
        serialNumber: vCardID, // Génère un ID unique
    };
    const pass = await PKPass.from(
      {
        model: path.join('./routes/api/QR-code/assets'),
        certificates: addCert() 
      },
      addProps(),
    );
    pass.type = "generic";
    if (type === "QR") {
        pass.setBarcodes({message:code,format:"PKBarcodeFormatQR"});
    } else {
        pass.setBarcodes({message:code,format:"PKBarcodeFormatCode128"});
    }
    pass.headerFields.push(addField('1','rev.',eCoucou().version));
    pass.primaryFields.push(addField('p1',"",nom,"PKTextAlignmentLeft"));
    pass.auxiliaryFields.push(addField('a1',"",code,"PKTextAlignmentLeft"));
    pass.backFields.push(addBack_id(vCardID));
    pass.backFields.push(addBack_www());
    pass.backFields.push(addBack_copyright());
    pass.backFields.push(addBack_terms());
    const buffer = pass.getAsBuffer();
    return buffer;
}

module.exports = { getPassWallet, getBarreCode };