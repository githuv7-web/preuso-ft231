const CACHE_NAME = 'ft231-v1';
const ASSETS = [
  './',
  './index.html'
];

// Instalación: Guarda el HTML en la memoria física del celular
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activación: Toma el control de la App de inmediato
self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

// Peticiones: Si no hay internet, entrega los archivos directo desde la memoria local
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request).catch(() => {
        return caches.match('./index.html');
      });
    })
  );
});
