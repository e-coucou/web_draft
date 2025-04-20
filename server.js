if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
} else {
    // Écriture des fichiers dans certs/
// Récupération des variables encodées
    const keyPem = Buffer.from(process.env.KEY_PEM, 'base64').toString('utf8');
    const certPem = Buffer.from(process.env.CERT_PEM, 'base64').toString('utf8');
    const certDir = path.join('/routes/api/qQR-code/', 'certs');
    fs.mkdirSync(certDir, { recursive: true });

    fs.writeFileSync(path.join(certDir, 'signerKey.pem'), keyPem);
    fs.writeFileSync(path.join(certDir, 'signerCert.pem'), certPem);
}
console.log(process.env.PORT)

var express = require('express');
// const {initFireDB} = require("./routes/api/QR-code/js/firebaseDB");

var app = express();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

require('dotenv').config();

var server = app.listen(process.env.PORT || 3000);

app.use(express.static('public'));
// initFireDB();

const QRcode = require("./routes/api/QR-code/qrcode");
app.use("/api/qrcode",QRcode);

//app.get("/api", (req, res) => {res.send("eCoucou")});

console.log('Mon serveur est en marche ... en 3000 localement');
