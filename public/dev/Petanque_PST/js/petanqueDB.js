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

  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig); // old
  let dbJoueurs,dbTypes,dbMatchs,dbTeam;
  let j_json,e_json,m_json,t_json, m_init_json;
  let equipes=[], matchs=[];

  
function preload() {
  j_json = loadJSON("./data/joueurs.json");
  e_json = loadJSON("./data/equipes.json");
  m_json = loadJSON("./data/matchs.json");
  m_init_json = loadJSON("./data/matchs_init.json");
  t_json = loadJSON("./data/type.json");

  let database = firebase.database();
  dbJoueurs  = database.ref('joueurs');
  dbTypes  = database.ref('types');
  dbMatchs  = database.ref('matchs');
  dbTeam  = database.ref('equipes');
  console.log("on charge")
 //  //Creation
	// for (let i=1;i<38;i++) {
	// 	let fichier = "../images/0"+((i>9)?'':'0')+i+".jpeg";
	// 	voitures[i-1] = new Voiture(i-1,fichier);
	// 	dbVoitures.push(voitures[i-1]);
	// 	img[i-1] = loadImage(fichier);
	// }
  //Lecture
  dbJoueurs.once('value').then ( (db) => {
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

  dbTeam.on("value", function (db) {equipes=db.val();});
  dbMatchs.on("value", function (db) {matchs=db.val();});

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
      console.log(dbJoueurs);
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
		dbJoueurs.update(updates);

  }
  function updateDB(db,val) {
    db.update(val);
  }

  function updateAll() {
    dbJoueurs.update(j_json);
    dbTeam.update(e_json);
    dbMatchs.update(m_json);
    dbTypes.update(t_json);
  }

  function matchId() {
    let l = Object.keys(m_json).length
    for (let i = 0; i < l ; i++) {
      m_json[i].id = int(i);
    }
  }

  function matchInit(a) {
    let id_ = (a-2020)*8;
    let id_m_ = (a-2020)*20;
    let team_A = equipes.filter(e=>{ return e.annee==a;});
    console.log(team_A);
    let updates = {};
    let m = matchs.filter(a=>{return a.annee==a;});
    console.log(m);
    if (m) {
      for (let i=0; i<20; i++) {
        console.log("a creer");
        let updt = m_init_json[i];
        updt.id = id_m_+i;
        updt.annee = a;
        updt.Sc1 = 0, updt.Sc2 = 0;
        updt.E1 = updt.E1+id_;
        updt.E2 = updt.E2+id_;
        // console.log(updt);
        firebase.database().ref('matchs/' + (id_m_+i)).set(updt);
      }
    } else {
      m.forEach(
          (e,i)=>{
              e.Sc1=0; e.Sc2=0;
              updates['/'+int(e.id)] = e;
          }
      )
      dbMatchs.update(updates);
    }
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