if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
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
