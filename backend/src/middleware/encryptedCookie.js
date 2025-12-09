import { encrypt, decrypt } from '../utils/crypto.js';
import config from '../config/config.js';

export function setEncryptedCookie(res, name, value, options = {}) {
  try {
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    const encryptedValue = encrypt(stringValue, config.COOKIE_SECRET);
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
      path: '/',
      ...options
    };
    res.cookie(name, encryptedValue, { ...cookieOptions, signed: true });
  } catch (error) {
    throw new Error(`Failed to set encrypted cookie: ${error.message}`);
  }
}

export function getEncryptedCookie(req, name, parseJSON = false) {
  try {
    const encryptedValue = req.signedCookies[name];
    if (!encryptedValue) {
      return null;
    }
    const decryptedValue = decrypt(encryptedValue, config.COOKIE_SECRET);
    if (parseJSON) {
      try {
        return JSON.parse(decryptedValue);
      } catch {
        return decryptedValue;
      }
    }
    return decryptedValue;
  } catch (error) {
    console.error(`Failed to decrypt cookie '${name}':`, error.message);
    return null;
  }
}

export function clearEncryptedCookie(res, name, options = {}) {
  res.clearCookie(name, options);
}

export function decryptCookiesMiddleware(req, res, next) {
  req.decryptedCookies = {};
  for (const [name, encryptedValue] of Object.entries(req.signedCookies)) {
    try {
      const decryptedValue = decrypt(encryptedValue, config.COOKIE_SECRET);
      try {
        req.decryptedCookies[name] = JSON.parse(decryptedValue);
      } catch {
        req.decryptedCookies[name] = decryptedValue;
      }
    } catch (error) {
      console.error(`Failed to decrypt cookie '${name}':`, error.message);
    }
  }
  next();
}

