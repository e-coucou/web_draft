const admin = require("firebase-admin");

const serviceAccount = require("../data/rky-metrics-cred.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rky-metrics-default-rtdb.europe-west1.firebasedatabase.app"
});

let database = admin.database();

module.exports = database;