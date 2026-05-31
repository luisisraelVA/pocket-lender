const CACHE_NAME = 'pocket-lender-v3'; // nueva versión para forzar limpieza

// Solo cacheamos recursos estáticos que no cambian con cada deploy
const urlsToCache = [
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/manifest.json'
];

self.addEventListener('install', event => {
  // Limpia caches viejas automáticamente
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => {
      if (key !== CACHE_NAME) return caches.delete(key);
    }))).then(() => {
      return caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache));
    })
  );
});

self.addEventListener('fetch', event => {
  // NUNCA cachear el index.html ni las navegaciones
  if (event.request.mode === 'navigate') {
    return fetch(event.request);
  }
  // Para otros recursos, intentar servir desde caché y actualizar en segundo plano
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        }
        return networkResponse;
      });
      return cachedResponse || fetchPromise;
    })
  );
});