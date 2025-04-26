const CACHE_NAME = 'ecoucou-cache-v3';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/data/manifest.json',
  '/data/pages.json',
  '/favicon.ico',
  '/vcard.html',
  '/wallet.html'
];

// self.addEventListener('install', event => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
//   );
// });

// self.addEventListener('activate', event => {
//   event.waitUntil(
//     caches.keys().then(keys =>
//       Promise.all(keys.map(key => {
//         if (key !== CACHE_NAME) return caches.delete(key);
//       }))
//     )
//   );
// });

// self.addEventListener('fetch', event => {
//   event.respondWith(
//     caches.match(event.request).then(resp => resp || fetch(event.request))
//   );
// });

// Phase d'installation : précache les fichiers de base
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_FILES))
  );
});

// Phase d'activation : nettoyage des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// Interception des fetchs : servir depuis le cache ou ajouter au cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then(networkResponse => {
        // Cache dynamiquement uniquement les requêtes GET et locales
        if (event.request.method === 'GET' && event.request.url.startsWith(self.location.origin)) {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        } else {
          return networkResponse;
        }
      }).catch(() => {
        // Optionnel : retourner une image offline par défaut si une image échoue
        if (event.request.destination === 'image') {
          return caches.match('/images/offline-placeholder.webp');
        }
      });
    })
  );
});

