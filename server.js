const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");
// const cors = require('cors');


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
} else {
    // Écriture des fichiers dans certs/
// Récupération des variables encodées
    const keyPem = Buffer.from(process.env.KEY_PEM, 'base64').toString('utf8');
    const certPem = Buffer.from(process.env.CERT_PEM, 'base64').toString('utf8');
    const certDir = path.join('./routes/api/QR-code/', 'certs');
    fs.mkdirSync(certDir, { recursive: true });

    fs.writeFileSync(path.join(certDir, 'signerKey.pem'), keyPem);
    fs.writeFileSync(path.join(certDir, 'signerCert.pem'), certPem);
}
// console.log(process.env.PORT)

var express = require('express');
// const {initFireDB} = require("./routes/api/QR-code/js/firebaseDB");

var app = express();
// app.use(cors());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.json());
app.use(cookieParser()); // avant les routes


require('dotenv').config();

app.use(express.static('public'));
// initFireDB();

const QRcode = require("./routes/api/QR-code/qrcode");
app.use("/api/qrcode",QRcode);

const Param = require("./routes/api/js/params");
app.use("/api/params",Param);

const {Metrics} = require("./routes/api/js/metrics");
app.use("/api/metrics",Metrics);

const signupRoute = require('./routes/config/signup');
app.use('/', signupRoute);

const loginRoute = require('./routes/config/login');
app.use('/', loginRoute);
const refreshRoute = require('./routes/config/refresh');
app.use('/', refreshRoute);
const resetPasswordRoute = require('./routes/config/reset_password');
app.use('/', resetPasswordRoute);
// Exemple route sécurisée
// const {requireAuth} = require('./routes/config/auth');
// app.get('/dashboard-data', requireAuth, (req, res) => {
//   res.json({ message: `Bienvenue ${req.user.email} !`, profil: req.user.profil });
// });

// Server start
const PORT = process.env.PORT || 3000;
//app.get("/api", (req, res) => {res.send("eCoucou")});
app.listen(PORT,() => console.log('Mon serveur est en marche ... en 3000 localement'));

console.log(process.env.NODE_ENV);
