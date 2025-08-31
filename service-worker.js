const CACHE_NAME = "paratha-full-v1";
const ASSETS = [
  './','./index.html','./styles.css','./script.js','./manifest.json','./icons/icon-192.png','./icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request).then(resp => resp || fetch(event.request)));
});