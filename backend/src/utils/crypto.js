import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 64;

export function generateResetToken() {
  const token = crypto.randomBytes(32).toString('hex');
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  return { token, hashed };
}

export function verifyToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateId(prefix) {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `${prefix}-${date}-${random}`;
}

export function encrypt(text, secret) {
  if (!text || !secret) {
    throw new Error('Text and secret are required for encryption');
  }

  const iv = crypto.randomBytes(IV_LENGTH);

  const salt = crypto.randomBytes(SALT_LENGTH);
  const key = crypto.scryptSync(secret, salt, 32);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return `${salt.toString('hex')}:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedData, secret) {
  if (!encryptedData || !secret) {
    throw new Error('Encrypted data and secret are required for decryption');
  }

  try {
    const parts = encryptedData.split(':');
    if (parts.length !== 4) {
      throw new Error('Invalid encrypted data format');
    }

    const [saltHex, ivHex, authTagHex, encrypted] = parts;

    const salt = Buffer.from(saltHex, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const key = crypto.scryptSync(secret, salt, 32);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    throw new Error(`Decryption failed: ${error.message}`);
  }
}