const passkit = require('passkit-generator');
const fs = require("fs");


async function getPassWallet() {
    const qrImagePath = "/public/images/image.png";

    const template = await passkit.createTemplate('generic', {
      passTypeIdentifier: 'pass.com.e-coucou.vcard',
      teamIdentifier: 'ABCD1234XY',
      organizationName: 'eCoucou',
      description: 'QR Code',
      logoText: 'vCard',
      backgroundColor: 'rgb(0,122,255)',
      foregroundColor: 'rgb(255,255,255)'
    });
    // Ajout des images obligatoires + QR code en strip
    template.images.add('icon.png', fs.readFileSync('./assets/icon.png'));
    template.images.add('logo.png', fs.readFileSync('./assets/logo.png'));
    template.images.add('image.png', fs.readFileSync(qrImagePath));

    const pass = template.createPass({
      serialNumber: Date.now().toString(),
      // pas de barcode → on utilise l’image uniquement
      primaryFields: [{
        key: 'info',
        label: 'Scan',
        value: 'QR Code vCard'
      }]
    });

    const stream = await pass.generate({
      cert: './certs/pass.p12',
      password: 'motdepasse', // ton mot de passe
      wwdr: './certs/AppleWWDR.pem'
    });

    return stream;

}

module.exports = {getPassWallet};