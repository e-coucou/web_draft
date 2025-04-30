const express = require('express');
const bcrypt = require('bcrypt');
const {database} = require('../api/js/realtime');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password, profil, nickname} = req.body;

  try {
    const snapshot = await database.ref('users').orderByChild('email').equalTo(email).once('value');
    if (snapshot.exists()) {
      return res.status(400).json({ success: false, message: 'Email déjà utilisé' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // const newUserRef = db.ref('users').push();
    const data={
        email:email,
        password: hashedPassword, // PASSWORD HASHÉ
        profil:profil,
        nickname:nickname
      };
    newUserRef = database.ref('users');
    await newUserRef.push(data);

    res.json({ success: true, message: 'Utilisateur créé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
