const {eCoucou} = require("./info");

const { PKPass } = require('passkit-generator');
const fs = require('fs');
const path = require('path');
const pass_tpl = require("./pass_template");
const { v4: uuidv4 } = require('uuid');

async function getPassWallet(vcardData, nom, societe, prenom, www, mobile, fonction, couleur) {
    function addCert() { return certs ; };
    function addProps() {return passData ; };
    function addGeneric() {return genericData ; };
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
    // Préparer les données spécifiques du pass
    const passData = {
      ...pass_tpl, // Copie les valeurs par défaut du template
      backgroundColor: couleur,
      teamIdentifier: process.env.ID_TEAM_APPLE,
      serialNumber: uuidv4(), // Génère un ID unique
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
    pass.headerFields.push(
        {
            key: "1",
            label: "V",
            value: eCoucou().version,
            textAlignment: "PKTextAlignmentCenter",
        });
    pass.primaryFields.push(
        {
            key: "p1",
            label: societe,
            value: prenom+' '+nom,
            textAlignment: "PKTextAlignmentLeft",
        });
    pass.secondaryFields.push(
            {
                key: "s1",
                label: fonction,
                value: mobile,
                textAlignment: "PKTextAlignmentLeft",
            },
            {
                key: "s2",
                label: "",
                value: www,
                textAlignment: "PKTextAlignmentLeft",
            },
        );
    pass.auxiliaryFields.push(
        {
            key: "a1",
            label: "by eCoucou",
            value: "",
            textAlignment: "PKTextAlignmentLeft",
        });
    console.log('---------------',pass);
    const buffer = pass.getAsBuffer();
    // const buffer = await PKPass.generate();


return buffer;

}

module.exports = { getPassWallet };