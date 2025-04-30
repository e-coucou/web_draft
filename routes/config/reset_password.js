const express = require('express');
const admin = require('../api/js/realtime');

const router = express.Router();

router.post('/reset-password', async (req, res) => {
  const { email } = req.body;
  try {
    const link = await admin.auth().generatePasswordResetLink(email);
    res.json({ success: true, message: 'Lien envoyé', link });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
