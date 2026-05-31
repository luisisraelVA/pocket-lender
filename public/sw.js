const CACHE_NAME = 'pocket-lender-v2';
const urlsToCache = [
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  // No cachear el index.html para evitar conflictos con nuevos deploys
  if (event.request.url.includes('index.html') || event.request.mode === 'navigate') {
    return fetch(event.request);
  }
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});