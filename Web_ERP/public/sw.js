const CACHE_NAME = 'maa-motors-erp-v7'; // Increment version to clear old caches
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest-icon.png',
  '/apple-touch-icon.png',
  'https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&family=Outfit:wght@400;600;700;800;900&family=Inter:wght@400;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js'
];

// Install Event: Cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log('[SW] Pre-caching critical assets');
      await cache.addAll(ASSETS_TO_CACHE);
      self.skipWaiting();
    })()
  );
});

// Activate Event: Delete old caches to free up storage
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
      self.clients.claim();
    })()
  );
});

// Fetch Event: Cache-First for internal app assets, Stale-While-Revalidate for others
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Skip non-GET requests (e.g. POST, PUT, DELETE for Firestore)
  if (request.method !== 'GET') return;

  // 2. Skip dynamic Firebase API calls (Firestore has its own offline persistence)
  if (url.hostname.includes('firestore.googleapis.com') ||
      url.hostname.includes('firebaseinstallations.googleapis.com') ||
      url.hostname.includes('google-analytics.com') ||
      url.hostname.includes('identitytoolkit.googleapis.com')) {
    return;
  }

  // 3. Strategy for Navigation (App HTML Shell)
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          return await fetch(request);
        } catch (error) {
          console.error("Navigation fetch failed, returning cached index.html", error);
          return await caches.match('/index.html');
        }
      })()
    );
    return;
  }

  // 4. Strategy for Assets (CSS, JS, Fonts, Images)
  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(request);
      
      if (cachedResponse) {
        // Return cached version immediately but also update it in background (Stale-While-Revalidate)
        (async () => {
          try {
            const networkResponse = await fetch(request);
            if (networkResponse && networkResponse.status === 200) {
              const cache = await caches.open(CACHE_NAME);
              await cache.put(request, networkResponse.clone());
            }
          } catch (error) {
            /* Ignore network errors if offline */
          }
        })();
        
        return cachedResponse;
      }

      // If not in cache, fetch from network and then cache it
      try {
        const networkResponse = await fetch(request);
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, responseToCache);
        return networkResponse;
      } catch (error) {
        console.error("Fetch failed", error);
        throw error;
      }
    })()
  );
});
