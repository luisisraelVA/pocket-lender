// Utilidades para el PIN de acceso (sin dependencia de crypto.subtle)
const PIN_KEY = 'pin_encoded';
const SESSION_KEY = 'unlocked_until';
const LOCK_TIMEOUT = 2 * 60 * 1000; // 2 minutos

// Clave simple para ofuscar (no es ultra segura pero evita ver el PIN a simple vista)
const XOR_KEY = 'PocketLender2024';

function simpleEncrypt(text) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ XOR_KEY.charCodeAt(i % XOR_KEY.length));
  }
  return btoa(result);
}

function simpleDecrypt(encoded) {
  try {
    const text = atob(encoded);
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ XOR_KEY.charCodeAt(i % XOR_KEY.length));
    }
    return result;
  } catch (e) {
    return '';
  }
}

export function setPin(pin) {
  const encoded = simpleEncrypt(pin);
  localStorage.setItem(PIN_KEY, encoded);
}

export function verifyPin(pin) {
  const storedEncoded = localStorage.getItem(PIN_KEY);
  if (!storedEncoded) return false;
  const decoded = simpleDecrypt(storedEncoded);
  return decoded === pin;
}

export function isPinSet() {
  return !!localStorage.getItem(PIN_KEY);
}

export function unlockApp() {
  const expires = Date.now() + LOCK_TIMEOUT;
  sessionStorage.setItem(SESSION_KEY, expires.toString());
}

export function isUnlocked() {
  const expires = sessionStorage.getItem(SESSION_KEY);
  if (!expires) return false;
  return Date.now() < parseInt(expires, 10);
}

export function lockApp() {
  sessionStorage.removeItem(SESSION_KEY);
}