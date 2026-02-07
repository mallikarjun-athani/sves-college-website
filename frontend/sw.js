const CACHE_NAME = 'sves-v2';
const ASSETS = [
    './',
    './index.html',
    './about.html',
    './contact.html',
    './faq.html',
    './virtual-tour.html',
    './compare-courses.html',
    './timetable.html',
    './facilities.html',
    './achievements.html',
    './portfolios.html',
    './assets/css/style.css',
    './assets/js/main.js',
    './assets/js/api.js',
    './assets/images/logo.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://unpkg.com/aos@2.3.1/dist/aos.css'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request).catch(() => {
                if (e.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (key !== CACHE_NAME) return caches.delete(key);
            })
        ))
    );
});
