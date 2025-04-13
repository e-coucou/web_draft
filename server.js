var express = require('express');
// const {initFireDB} = require("./routes/api/QR-code/js/firebaseDB");

var app = express();
require('dotenv').config();

var server = app.listen(process.env.PORT || 3000);

app.use(express.static('public'));
// initFireDB();

const QRcode = require("./routes/api/QR-code/qrcode");
app.use("/api/qrcode",QRcode);
//app.get("/api", (req, res) => {res.send("eCoucou")});

console.log('Mon serveur est en marche ... en 3000 localement');
