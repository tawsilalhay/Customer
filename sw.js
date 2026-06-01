var CACHE_NAME = 'alhay-v2';

// Install - لا نخزن شيء عشان ما يتعارض مع Firebase
self.addEventListener('install', function(e) {
  self.skipWaiting();
});

// Activate - نمسح كل الكاش القديم
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) {
        return caches.delete(k);
      }));
    })
  );
  self.clients.claim();
});

// Fetch - network only (لا نخزن شيء)
self.addEventListener('fetch', function(e) {
  e.respondWith(fetch(e.request));
});

// Push Notifications
self.addEventListener('push', function(e) {
  var data = e.data ? e.data.json() : {};
  var title = data.title || 'توصيل الحي 🛵';
  var options = {
    body: data.body || 'لديك تحديث جديد',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    dir: 'rtl',
    lang: 'ar',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' }
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

// Notification click
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data.url || '/'));
});
