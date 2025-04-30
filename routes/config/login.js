const express = require('express');
const jwt = require('jsonwebtoken');
const {database} = require('../api/js/realtime');
const bcrypt = require('bcrypt');
const { JWT_SECRET, JWT_REFRESH_SECRET } = require('./secret');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const snapshot = await database.ref('users').orderByChild('email').equalTo(email).once('value');

    if (!snapshot.exists()) {
      return res.status(401).json({ success: false, message: 'Email introuvable' });
    }

    let userData = null;
    snapshot.forEach(childSnapshot => {
      const user = childSnapshot.val();
      if (bcrypt.compareSync(password, user.password)) {  // COMPARAISON BCRYPT
        userData = { id: childSnapshot.key, ...user };
      }
    });

    if (!userData) {
      return res.status(401).json({ success: false, message: 'Mot de passe incorrect' });
    }

    const payload = { id: userData.id, email: userData.email, profil: userData.profil, nickname: userData.nickname };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });

    res.json({ success: true, accessToken, refreshToken, nickname:payload.nickname });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
