const CACHE_NAME = 'edulm-cache-v187';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './styles.css?v=187',
  './edu_lm_v112_universal.js',
  './edu_lm_v112_universal.js?v=187',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        ASSETS_TO_CACHE.map(url => cache.add(url).catch(err => console.warn('SW Install: Fallo al cachear', url, err)))
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }
  
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // Network First para la aplicación principal (HTML y script universal) para evitar caché obsoleta
  const isAppCore = event.request.mode === 'navigate' || 
                    url.pathname.endsWith('index.html') || 
                    url.pathname.endsWith('/') || 
                    url.pathname.includes('edu_lm_v112_universal.js');

  if (isAppCore) {
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache First para recursos estáticos secundarios (iconos, css, etc.)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(err => {
        if (!cachedResponse) throw err;
      });
      return cachedResponse || fetchPromise.then(res => res || caches.match(event.request));
    })
  );
});
