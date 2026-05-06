const CACHE_NAME = 'abuela-tata-area-v2';

const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/favicon.png',
  './assets/logo.png',
  './assets/favicon.png',
  './pedidos.html',
  './multimedia.html',
  './tarifa.html',
  './calendario.html',
  './condiciones.html'
];

// Instala y precachea archivos base
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      try {
        await cache.addAll(URLS_TO_CACHE);
      } catch (err) {
        console.warn('No se pudieron guardar todos los archivos en caché:', err);
      }
    })
  );
  self.skipWaiting();
});

// Activa y borra cachés antiguas
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
    ).then(() => self.clients.claim())
  );
});

// Estrategia:
// - Para HTML: intenta red primero, si falla usa caché
// - Para resto: usa caché primero y actualiza en segundo plano
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const request = event.request;
  const url = new URL(request.url);

  // Solo manejar mismas rutas del sitio
  if (url.origin !== location.origin) return;

  // Para páginas HTML: network first
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy)).catch(() => {});
          return response;
        })
        .catch(() => caches.match(request).then(cached => cached || caches.match('./index.html')))
    );
    return;
  }

  // Para imágenes, css, js, etc: cache first
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy)).catch(() => {});
        return response;
      });
    })
  );
});
 
