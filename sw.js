const CACHE_NAME = 'lotto-cache-v8'; // 수동·자동 번호 생성 화면 강제 업데이트
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './main.js',
  './manifest.json'
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
  // 네트워크 우선(Network-First) 전략으로 변경:
  // 항상 최신 파일을 받아오고, 오프라인일 때만 캐시를 사용
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
