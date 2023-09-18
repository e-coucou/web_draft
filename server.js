var express = require('express');

var app = express();
require('dotenv').config();

var server = app.listen(process.env.PORT || 3000);

app.use(express.static('public'));

console.log('Mon serveur est en marche ... en 3000 localement');
