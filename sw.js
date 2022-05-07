const staticCacheName = 'site-static-v1';
const dynamicCacheName = 'site-dynamic-v1';

const staticAssets = [
    '/',
    '/pages/index.html',
    '/assets/images/logo svg.svg',
    '/assets/css/build.css',
    '/assets/js/app.js',
    '/assets/js/mobile-menu.js',
    '/pages/about-us.html',
    '/pages/contact-us.html',
    '/pages/medical-services.html',
    '/medical-services/ear-conditions-treatments-surgeries.html',
    '/pages/fallback.html',
];

//install service worker
self.addEventListener('install', evt => {
    // console.log('service worker has been intalled');
    evt.waitUntil( 
        caches.open(staticCacheName).then(cache => {
            cache.addAll(staticAssets);
            console.log('cache shell assets');
        })
    )
});

//activate service worker
self.addEventListener('activate', evt => {
    // console.log('service worker is activated');
    evt.waitUntil(
        caches.keys().then(keys => {
            // console.log(keys);
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
            );
        })
    );
});

//fetch event
self.addEventListener('fetch', evt => {
    // console.log('fetch event', evt);
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request).then(fetchRes => {
                return caches.open(dynamicCacheName).then(cache => {
                    cache.put(evt.request.url, fetchRes.clone());
                    return fetchRes;
                }) 
            });
        }).catch(() => caches.match('/pages/fallback.html'))
    );
});