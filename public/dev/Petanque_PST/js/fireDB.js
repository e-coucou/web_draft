  // Import the functions you need from the SDKs you need
    // import firebase from "firebase/compat/app";
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
//     import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";
    // import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';
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
    appId: "1:719166388179:web:37a35693f330b7a31fe126",
    measurementId: "G-DMS745VTTR"
  };

  // const firebaseConfig = {
  //   apiKey: "AIzaSyCwsXvdYCtmwqHCdd0MQkFky1w53M_SKns",
  //   authDomain: "rky-001.firebaseapp.com",
  //   databaseURL: "https://rky-001.firebaseio.com",
  //   projectId: "rky-001",
  //   storageBucket: "rky-001.appspot.com",
  //   messagingSenderId: "719166388179",
  //   appId: "1:719166388179:web:8d68aab6ef6a1f241fe126",
  //   measurementId: "G-Z2ZXH0TZ0J"
  // };

  // Initialize Firebase
  // const app = initializeApp(firebaseConfig); // new
  const app = firebase.initializeApp(firebaseConfig); // old
  let dbVoitures, voitures=[], img=[];
  let j_json,e_json,m_json,t_json;
  // console.log(app)

  // let database = getDatabase(app); // new
  // let db = firebase.database();
//   console.log(database);
// console.log(db);

  
function preload() {
    j_json = loadJSON("./data/joueurs.json");
    e_json = loadJSON("./data/equipes.json");
    m_json = loadJSON("./data/matchs.json");
    t_json = loadJSON("./data/type.json");

      let database = firebase.database();
      dbVoitures  = database.ref('joueurs');
      console.log("on charge")
 //  //Creation
	// for (let i=1;i<38;i++) {
	// 	let fichier = "../images/0"+((i>9)?'':'0')+i+".jpeg";
	// 	voitures[i-1] = new Voiture(i-1,fichier);
	// 	dbVoitures.push(voitures[i-1]);
	// 	img[i-1] = loadImage(fichier);
	// }
  //Lecture
  	dbVoitures.once('value').then ( (db) => {
  		let data = db.val();
  		let keys = Object.keys(data);

  		keys.forEach( k => {
  			// console.log(data[k]);
  			// let fichier = data[k].fichier;
			// voitures.push( new Voiture(data[k].idx,fichier,data[k].elo,data[k].comp,data[k].K, k) );
      console.log(data[k])
      });
			// img[data[k].idx] = loadImage(fichier);
  	console.log('Chargement terminé ...');
  });

  	// database.on('value').then ( (db) => {
  	// 	let data = db.val();
  	// 	let keys = Object.keys(data);

  	// 	keys.forEach( k => {
  	// 		// console.log(data[k]);
  	// 		let fichier = data[k].fichier;
		// 	voitures.push( new Voiture(data[k].idx,fichier,data[k].elo,data[k].comp,data[k].K, k) );
		// 	img[data[k].idx] = loadImage(fichier);
  	// 	})
  	// console.log('Chargement terminé ...');
    // })
  }

    function setup() {
      console.log(voitures);
    }

    function addUser(userId, name, elo ) {
  firebase.database().ref('joueurs/' + userId).set({
    nom: name,
    id: userId,
    elo : elo
  });
  }

  function updateUser(userId) {
    		let updates = {};
      updates['/'+userId] = {
        nom: '______',
        id: userId,
              elo : 20
            };
		dbVoitures.update(updates);

  }
  function updateAll(val) {
    dbVoitures.update(val);
  }


//   const analytics = getAnalytics(app);


//------------------
class Voiture {
	constructor(i_,file_,elo_,comp_,K_,key_) {
		this.idx = i_;
		this.elo = elo_;
		this.comp = comp_;
		this. K = K_;
		this.fichier = file_;
		this.key = key_;
	}

	update(w_,e_) {
		//w = 0 perdu, 0.5 null, 1 gagné
		// e1 = e0 +  k x (W - p(D))
		// K = 40 ( moins de 30 challenges)
		// K = 20 sir e < 2400
		// K = 10 si e > 2400
		// D différence de e (e(m) - e(o))
		this.comp++;
		if (this.comp > 30 && this.K != 10) this.K = 20;
		let D = this.elo - e_;
		let pD = 1 / (1 + pow(10,-D/400));
		this.elo += this.K *(w_ - pD);
	}
}