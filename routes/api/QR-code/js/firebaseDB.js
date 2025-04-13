// Import the functions you need from the SDKs you need
const {initializeApp} = require("firebase/app");
const {getFirestore, doc, setDoc } = require("firebase/firestore");
const admin = require("firebase-admin");
// const admin = require("firebase-admin");
// const { getAnalytics } = require("firebase/analytics");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwVjWIKFKEJh4o5nmFE-HLE3299T8p3ew",
  authDomain: "rky-001.firebaseapp.com",
  databaseURL: "https://rky-001.firebaseio.com",
  projectId: "rky-001",
  storageBucket: "rky-001.firebasestorage.app",
  messagingSenderId: "719166388179",
  appId: "1:719166388179:web:5a388303c1ee10e51fe126",
  measurementId: "G-GSBVLR96M4"
};

// Initialize Firebase
let app;
let firestoreDB;
// const analyticsDB = getAnalytics(app);
const initFireDB = () => {
  app = initializeApp(firebaseConfig);
  console.log('APP',app);
  firestoreDB = getFirestore();
  return app;
};

const firebaseUpload = async () => {
  const data = {
    type: "data",
    mess: "OK",
    val: 2
  };
  const docDB = doc(firestoreDB,"metrics","uniqueID");
  let update = await setDoc(docDB,data); 
  return update;
}

const getFirebaseApp = () => app;

module.exports = {
  initFireDB,
  getFirebaseApp,
  firebaseUpload
}