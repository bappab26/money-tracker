// Money Tracker's offline copy: the app's page, its icons and the libraries it loads. The page is
// fetched fresh when online (so a new version shows up at once) and taken from here when offline.
// Sign-in, OneDrive and price lookups always go to the network.
// "Fresh" means asking the site every time ('no-cache'; a quick "not modified" when nothing
// changed): GitHub Pages lets browsers reuse a page for 10 minutes, which held back new versions.
const CACHE = 'money-tracker-v1';
const LIBS = [
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
];
const CORE = ['./', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', ...LIBS];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE.map(u => new Request(u, { cache: 'no-cache' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET') return;
  if (url.origin === location.origin) {
    // the app itself: network first, the saved copy when offline. A page load is fetched by its
    // address, since a browser's own page request cannot be given a cache setting
    const fresh = req.mode === 'navigate' ? fetch(req.url, { cache: 'no-cache', redirect: 'manual' }) : fetch(req, { cache: 'no-cache' });
    e.respondWith(fresh.then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(url.pathname.endsWith('/') ? './' : req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./'))));
  } else if (LIBS.includes(req.url)) {
    // the libraries never change at a given version: the saved copy first
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy));
      return res;
    })));
  }
});
