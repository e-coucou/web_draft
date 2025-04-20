const { PKPass } = require('passkit-generator');
const fs = require('fs');
const path = require('path');

async function getPassWallet() {

    const pass = await PKPass.from(
      {
        model: path.join('./routes/api/QR-code/assets'),
        certificates: {
          wwdr: fs.readFileSync('./routes/api/QR-code/certs/wwdr.pem'),
          signerCert: fs.readFileSync('./routes/api/QR-code/certs/signerCert.pem'),
          signerKey: fs.readFileSync('./routes/api/QR-code/certs/signerKey.pem'),
          signerKeyPassphrase: 'Penelope075!'
        }
      },
      {
        type: 'generic', // requis
        serialNumber: '1234567890',
        description: 'Pass QR personnalisé',
        organizationName: 'eCoucou',
        logoText: 'Accès'
      }
    );

    const buffer = pass.getAsBuffer();

return buffer;

}

module.exports = {getPassWallet};