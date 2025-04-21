const { PKPass } = require('passkit-generator');
const fs = require('fs');
const path = require('path');
const pass_tpl = require("./pass_template");
const { v4: uuidv4 } = require('uuid');

async function getPassWallet() {

    function addCert() { return certs ; };
    function addProps() {return passData ; };
    // --- Configuration Essentielle (les certifcats/les clés) ---
    const CERT_FOLDER = path.join('./routes/api/QR-code/', 'certs'); // Dossier où sont stockés les certificats
    const signerCert = path.join(CERT_FOLDER, 'signerCert.pem');
    const signerKey = path.join(CERT_FOLDER, 'signerKey.pem');
    const WWDR = path.join(CERT_FOLDER, 'wwdr.pem');
    const signerKeyPassphrase = process.env.KEYPASSPHRASE; // Mot de passe du fichier .p12
    const { vcardData, nom, societe } = {vcardData:'BEGIN:VCARD VERSION:4.0 FN:John DOE N:DOE;John;;; EMAIL;TYPE=INTERNET:john.doe@e-coucou.com END VCARD', nom:'Eric', societe:'eCoucou'};
 
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
      teamIdentifier: process.env.ID_TEAM_APPLE,
      serialNumber: uuidv4(), // Génère un ID unique
      barcode: {
        ...pass_tpl.barcode, // Garde le format et l'encoding
        message: vcardData, // Insère les données vCard pour le QR code
        altText: `Carte de Visite: ${nom}`, // Texte alternatif
      },
      generic: { // Remplace/ajoute les valeurs spécifiques
        ...pass_tpl.generic,
        primaryFields: [{ ...pass_tpl.generic.primaryFields[0], value: nom }],
        secondaryFields: societe ? [{ ...pass_tpl.generic.secondaryFields[0], value: societe }] : [], // Ajoute société si fournie
      },
    };
    // console.log(passData);
    // const pass_i = new PKPass(passData, certs);
    // pass_i.type = 'generic';
    // OLD by EP
    // console.log(pass_i);
    const pass = await PKPass.from(
      {
        model: path.join('./routes/api/QR-code/assets'),
        certificates: addCert() 
      },
      addProps(),
    // {
    //       wwdr: fs.readFileSync('./routes/api/QR-code/certs/wwdr.pem'),
    //       signerCert: fs.readFileSync('./routes/api/QR-code/certs/signerCert.pem'),
    //       signerKey: fs.readFileSync('./routes/api/QR-code/certs/signerKey.pem'),
    //       signerKeyPassphrase: signerKeyPassphrase
    //     }
    //     serialNumber: '1234567890',
    //     description: 'Mes coordonnées',
    //     organizationName: 'eCoucou',
    //     logoText: 'vCard'
    );
    pass.type = "generic";
    console.log('---------------',pass);
    const buffer = pass.getAsBuffer();
    // const buffer = await PKPass.generate();


return buffer;

}

module.exports = { getPassWallet };