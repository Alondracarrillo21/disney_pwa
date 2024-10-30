// sw.js

// Instala el Service Worker y precacha archivos
self.addEventListener('install', (event) => {
  event.waitUntil(
      caches.open('v1').then((cache) => {
          return cache.addAll([
              '/',
              '/index.html',
              '/styles.css',
              '/app.js',
              '/imgs/icon192.png',
              '/imgs/icon512.png',
              '/imgs/icon512_maskable.png',
              // Agrega aquí otros archivos que desees precachar
          ]);
      })
  );
});

// Activa el Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
      caches.keys().then((cacheNames) => {
          return Promise.all(
              cacheNames.map((cacheName) => {
                  if (cacheName !== 'v1') {
                      return caches.delete(cacheName); // Elimina cachés antiguas
                  }
              })
          );
      })
  );
});

// Maneja las solicitudes de red
self.addEventListener('fetch', (event) => {
  event.respondWith(
      caches.match(event.request).then((response) => {
          return response || fetch(event.request); // Devuelve el recurso del caché o lo solicita a la red
      })
  );
});

// Maneja las notificaciones push
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'Notificación', body: 'Tienes una nueva notificación.' };

  const options = {
      body: data.body,
      icon: 'imgs/icon512_maskable.png', // Ruta a tu icono
      badge: 'imgs/badge.png', // Ruta a tu badge (opcional)
  };

  event.waitUntil(
      self.registration.showNotification(data.title, options)
  );
});

// Maneja el clic en la notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
      clients.openWindow('/') // Abre la página principal cuando se hace clic en la notificación
  );
});