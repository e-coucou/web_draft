const {eCoucou} = require("../QR-code/js/info");

const express = require("express");
const fs = require("fs");
const path = require("path");
const Metrics = express.Router();
const { createCanvas } = require("canvas");
const { Parser } = require('json2csv');

const {encrypt,decrypt,encryptToCompactJSON,decryptFromCompactJSON} = require("./crypto-aes");
const SECRET_KEY = process.env.SECRET_KEY;
const database = require("./realtime");

Metrics.use(express.json());
Metrics.get("/records", async (req, res) => {
    const snapshot = await database.ref('records').once('value');
    const allData = snapshot.val();
    const dataArray = Object.entries(allData).map(([id, item]) => ({ id,...item }));
    res.status(200).json(dataArray);
});
Metrics.get("/delete", async (req, res) => {
    const ref = database.ref('records');
    ref.child('-OOsHHKYg5aDzIyyVjZi').remove();
    res.status(200).send("deleted");
});
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

async function logRecord(source, type, _data) {
    const cypher = encryptToCompactJSON(JSON.stringify(_data),SECRET_KEY);
    const data = {
        type: type,
        version: eCoucou(),
        time: new Date().getTime(),
        data: cypher,
    }
    let ref = database.ref(source);
    ref.push(data)
    .then(()=> { console.log("recorded ..."); })
    .catch(err => {console.log(err); });    
}


module.exports = {Metrics, logMetrics_qrcode, logRecord};