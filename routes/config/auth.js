const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./secret');

// auth par token header
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log(authHeader)

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
// auth par token dans cookies
function requireAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).send('Non authentifié');
  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user; // accessible ensuite
    next();
  } catch (err) {
    res.status(403).send('Token invalide');
  }
}

module.exports = {authenticateToken, requireAuth};