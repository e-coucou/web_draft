const crypto = require('crypto');

const ALGO = 'aes-256-gcm';
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const KEY_LENGTH = 32;
const TAG_LENGTH = 16;
const ITERATIONS = 100000;

/**
 * Dérive une clé à partir d’un mot de passe et d’un sel
 */
function deriveKey(password, salt) {
  return crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, 'sha256');
}

/**
 * Chiffre un message en AES-GCM avec un mot de passe
 */
function encrypt(message, password) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);
  const key = deriveKey(password, salt);

  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(message, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    iv: iv.toString('hex'),
    salt: salt.toString('hex'),
    ciphertext: encrypted.toString('hex'),
    tag: tag.toString('hex')
  };
}

function encryptToCompactJSON(message, password) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);
  const key = deriveKey(password, salt);

  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(message, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  const compactPayload = {
    iv: iv.toString('base64'),
    salt: salt.toString('base64'),
    ciphertext: encrypted.toString('base64'),
    tag: tag.toString('base64')
  };

  return Buffer.from(JSON.stringify(compactPayload)).toString('base64');
}
/**
 * Déchiffre un message AES-GCM avec un mot de passe
 */
function decrypt({ ciphertext, iv, salt, tag }, password) {
  const key = deriveKey(password, Buffer.from(salt, 'hex'));
  const decipher = crypto.createDecipheriv(ALGO, key, Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(tag, 'hex'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(ciphertext, 'hex')),
    decipher.final()
  ]);

  return decrypted.toString('utf8');
}

function decryptFromCompactJSON(compactBase64, password) {
  const payload = JSON.parse(Buffer.from(compactBase64, 'base64').toString('utf8'));

  const { ciphertext, iv, salt, tag } = payload;
  return decrypt(
    {
      ciphertext: Buffer.from(ciphertext, 'base64').toString('hex'),
      iv: Buffer.from(iv, 'base64').toString('hex'),
      salt: Buffer.from(salt, 'base64').toString('hex'),
      tag: Buffer.from(tag, 'base64').toString('hex')
    },
    password
  );
}

module.exports = { encrypt, decrypt, encryptToCompactJSON, decryptFromCompactJSON};