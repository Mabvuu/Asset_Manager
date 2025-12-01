// src/lib/hashUtil.js
import CryptoJS from 'crypto-js';

export function sha256Hex(input) {
  return CryptoJS.SHA256(typeof input === 'string' ? input : JSON.stringify(input)).toString(CryptoJS.enc.Hex);
}
