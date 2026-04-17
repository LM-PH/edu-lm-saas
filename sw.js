const CACHE_NAME = 'edulm-cache-v33';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './saas_master_core.js?v=FORCE_UPDATE_FINAL',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Instalación: Cacheamos los archivos base
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activación: Limpiamos caches viejas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Estrategia de Fetch
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Estrategia NETWORK FIRST para la base de datos (Supabase)
  // Queremos que los profes siempre vean la asistencia real si hay internet
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Si falla internet, intentamos ver si hay algo en cache (útil para lectura de perfiles/config)
          return caches.match(event.request);
        })
    );
    return;
  }

  // 2. Estrategia STALE-WHILE-REVALIDATE para el resto de archivos (PWA Shell)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });
      return cachedResponse || fetchPromise;
    })
  );
});
