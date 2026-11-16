// Onyx service worker — makes the web app installable and usable offline.
// Strategy:
//   • Navigations (any page URL)  → network first, fall back to the cached app shell.
//   • Hashed build assets (/_expo) → cache first (file names change on every build).
//   • Icons, fonts and product photos → stale-while-revalidate.
// Bump CACHE_VERSION whenever the shell changes to force clients to refresh.

const CACHE_VERSION = 'onyx-v1';
const SHELL_CACHE = `${CACHE_VERSION}-shell`;
const ASSET_CACHE = `${CACHE_VERSION}-assets`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
const SHELL_URL = '/index.html';
const PRECACHE = [SHELL_URL, '/manifest.webmanifest', '/icon-192.png', '/icon-512.png', '/favicon.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => !k.startsWith(CACHE_VERSION)).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 1. Page navigations: always try the network so content is fresh; offline → app shell.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(SHELL_CACHE).then((cache) => cache.put(SHELL_URL, copy));
          return response;
        })
        .catch(() => caches.match(SHELL_URL, { cacheName: SHELL_CACHE })),
    );
    return;
  }

  // Only handle our own origin here; cross-origin images are handled below.
  if (url.origin === self.location.origin) {
    // 2. Hashed bundles: cache first.
    if (url.pathname.startsWith('/_expo/')) {
      event.respondWith(cacheFirst(request, ASSET_CACHE));
      return;
    }
    // 3. Icons and other same-origin static files.
    if (/\.(png|jpe?g|svg|ico|webp|woff2?|ttf)$/i.test(url.pathname)) {
      event.respondWith(staleWhileRevalidate(request, ASSET_CACHE));
      return;
    }
    return;
  }

  // 4. Product photos from the CDN.
  if (request.destination === 'image') {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
  }
});

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  if (hit) return hit;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response.ok || response.type === 'opaque') cache.put(request, response.clone());
      return response;
    })
    .catch(() => hit);
  return hit || network;
}
