const CACHE_NAME = 'lotto-cache-v23'; // 애드센스 심사용 콘텐츠·탐색 안정판
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './main.js',
  './manifest.json',
  './guide.html',
  './privacy.html'
];

self.addEventListener('install', event => {
  // 새 서비스워커를 즉시 대기열에서 활성화로 넘김
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  // 이전 버전의 캐시(lotto-cache-v1)를 모두 삭제
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  // 광고·통계·웹폰트 등 외부 요청은 서비스워커가 가로채지 않는다.
  if (requestUrl.origin !== self.location.origin) return;

  // 같은 사이트 파일만 네트워크 우선으로 받고, 오프라인일 때 캐시를 사용한다.
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request, { ignoreSearch: true });
    })
  );
});
