// KAPT 대시보드 서비스 워커: 항상 최신 화면을 먼저 받아오고, 인터넷이 끊기면 마지막으로 본 화면을 보여준다.
const CACHE = 'kapt-dashboard';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request, {cache: 'no-store'})
      .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res; })
      .catch(() => caches.match(e.request, {ignoreSearch: true}))
  );
});
