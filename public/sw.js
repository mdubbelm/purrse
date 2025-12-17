/**
 * Purrse - Service Worker
 * Zorgt voor offline werking
 */

const CACHE_NAME = 'purrse-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Installatie - cache assets
self.addEventListener('install', (event) => {
  console.log('Purrse: Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Purrse: Caching assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // NIET direct skipWaiting() aanroepen - wacht op gebruiker actie
});

// Message handler - voor controlled updates
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    console.log('Purrse: SKIP_WAITING ontvangen, activating...');
    self.skipWaiting();
  }
});

// Activatie - ruim oude caches op
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  // Neem controle over alle clients
  self.clients.claim();
});

// Fetch - serveer uit cache, fallback naar netwerk
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip chrome-extension en andere non-http requests
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cache als beschikbaar
      if (cachedResponse) {
        // Update cache in achtergrond (stale-while-revalidate)
        event.waitUntil(
          fetch(event.request).then((networkResponse) => {
            if (networkResponse.ok) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          }).catch(() => {})
        );
        return cachedResponse;
      }

      // Geen cache, haal van netwerk
      return fetch(event.request).then((networkResponse) => {
        // Cache succesvolle responses
        if (networkResponse.ok) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Offline en niet in cache
        console.log('Purrse: Offline, niet in cache:', event.request.url);
      });
    })
  );
});
