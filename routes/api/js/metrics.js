const {eCoucou} = require("../QR-code/js/info");

const express = require("express");
const fs = require("fs");
const path = require("path");
const Metrics = express.Router();
const { createCanvas } = require("canvas");
const { Parser } = require('json2csv');
const {authenticateToken, requireAuth} = require("../../config/auth");
const {database} = require("./realtime");

const {encrypt,decrypt,encryptToCompactJSON,decryptFromCompactJSON} = require("./crypto-aes");
const { profile } = require("console");
const SECRET_KEY = process.env.SECRET_KEY;

async function authProfil(email) {
    const snapshot = await database.ref('users').orderByChild('email').equalTo(email).once('value');
    if (! snapshot.exists()) {
        return undefined;
    } else {
        const profil = Object.entries(snapshot.val()).map(([id, item]) => ({ id,...item }));
        return profil;
    }
}
Metrics.use(express.json());
Metrics.get("/secret", requireAuth, async (req, res) => {
    const email = req.user.email; // email validé via token
    try {
        const profil = await authProfil(email);
        const role = profil[0].profil;
        if (profil===undefined) {
            return res.status(400).json({ success: false, message: 'User introuvable' });
        } else {
            res.json({success: true, profil: profil[0], role:role})
        }
    } catch (err) {
      res.status(500).json({ message: 'Erreur serveur' });
    }
});
Metrics.get("/records", async (req, res) => {
    const snapshot = await database.ref('records').once('value');
    const allData = snapshot.val();
    const dataArray = Object.entries(allData).map(([id, item]) => ({ id,...item }));
    let all=[];
    dataArray.forEach(( item) => { all.push({other:item, cypher: JSON.parse(decryptFromCompactJSON(item.data, SECRET_KEY))})});
    res.status(200).json(all);
    // res.status(200).json({cypher: JSON.parse(decryptFromCompactJSON(dataArray[0].data, SECRET_KEY)), other: dataArray[0]});
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