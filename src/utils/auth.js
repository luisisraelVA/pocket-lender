// Utilidades para el PIN de acceso
const PIN_KEY = 'pin_hash';
const SESSION_KEY = 'unlocked_until';
const LOCK_TIMEOUT = 2 * 60 * 1000; // 2 minutos en segundo plano

// Hash SHA-256 del PIN (solo funciona en HTTPS o localhost)
async function hashPin(pin) {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function setPin(pin) {
  const hash = await hashPin(pin);
  localStorage.setItem(PIN_KEY, hash);
}

export async function verifyPin(pin) {
  const storedHash = localStorage.getItem(PIN_KEY);
  if (!storedHash) return false;
  const hash = await hashPin(pin);
  return hash === storedHash;
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