const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const { createCanvas } = require("canvas");
const { Parser } = require('json2csv');

const {encrypt,decrypt,encryptToCompactJSON,decryptFromCompactJSON} = require("../QR-code/js/crypto-aes");
const SECRET_KEY = process.env.SECRET_KEY;
const database = require("../QR-code/js/realtime");

async function logMetrics_qrcode(source, type, level, qualite, version, option, _txt  ) {
    const cypher = encryptToCompactJSON(_txt,SECRET_KEY);
    const data = {
        type: type,
        level: level,
        version: version,
        qualite: qualite,
        option: option,
        time: new Date().getTime(),
        vcard: cypher
    }
    let ref = database.ref(source);
    ref.push(data)
    .then(()=> { console.log("Metrics Logged"); })
    .catch(err => {console.log(err); });
}

async function logTrail(source, data_) {
    const cypher = encryptToCompactJSON(_txt,SECRET_KEY);
    const data = {
        type: type,
        level: level,
        version: version,
        qualite: qualite,
        option: option,
        time: new Date().getTime(),
        vcard: cypher
    }
    let ref = database.ref(source);
    ref.push(data)
    .then(()=> { console.log("Trail Logged"); })
    .catch(err => {console.log(err); });    
}


module.exports = {logMetrics_qrcode, logTrail};