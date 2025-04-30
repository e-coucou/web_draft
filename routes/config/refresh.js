const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_REFRESH_SECRET, JWT_SECRET } = require('./secret');

const router = express.Router();

router.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, profil: user.profil },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
    res.json({ accessToken });
  });
});

module.exports = router;
