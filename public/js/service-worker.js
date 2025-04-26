const CACHE_NAME = 'ecoucou-cache-v2';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/data/manifest.json',
  '/data/pages.json',
  '/favicon.ico',
  '/vcard.html',
  '/wallet.html',
  '/images/wallet.png',
  '/images/vcard.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
