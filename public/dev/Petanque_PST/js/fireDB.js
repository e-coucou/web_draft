  // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
    import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';
//   import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCwsXvdYCtmwqHCdd0MQkFky1w53M_SKns",
    authDomain: "rky-001.firebaseapp.com",
    databaseURL: "https://rky-001.firebaseio.com",
    projectId: "rky-001",
    storageBucket: "rky-001.appspot.com",
    messagingSenderId: "719166388179",
    appId: "1:719166388179:web:8d68aab6ef6a1f241fe126",
    measurementId: "G-Z2ZXH0TZ0J"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  console.log(app)

  let database = getFirestore(app);
//   console.log(database);
let   dbVoitures  = getFirestore('voitures');
let voitures = [];
console.log(dbVoitures);

  	database.once('value').then ( (db) => {
  		let data = db.val();
  		let keys = Object.keys(data);

  		keys.forEach( k => {
  			// console.log(data[k]);
  			let fichier = data[k].fichier;
			voitures.push( new Voiture(data[k].idx,fichier,data[k].elo,data[k].comp,data[k].K, k) );
			img[data[k].idx] = loadImage(fichier);
  		})
	console.log('Chargement terminé ...');
    })

//   const analytics = getAnalytics(app);
