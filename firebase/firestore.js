const admin = require("firebase-admin");
const config = require('../config');
const path = require('path');

const serviceAccount = require(path.join(__dirname+`/admin-key.json`));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.firestoreURL
});
const firestore = admin.firestore();

module.exports = firestore;