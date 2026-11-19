// Cache-first service worker so the app works fully offline after the first load.
// Bump VERSION whenever index.html or defaults.json changes to force clients to refresh the cache.
const VERSION = 'sportpa-v27';
const FILES = ['./', './index.html', './manifest.json', './defaults.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// Stale-while-revalidate: answer from the cache (works offline), refresh the cache in the background
// so the next start already has the latest files, even without bumping VERSION.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(VERSION).then(c => c.match(e.request).then(hit => {
    const net = fetch(e.request).then(r => { if (r && r.ok && r.type === 'basic') c.put(e.request, r.clone()); return r; }).catch(() => null);
    return hit || net.then(r => r || c.match('./index.html'));
  })));
});
