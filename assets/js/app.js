//service worker support validation
if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js')
    .then((reg) => console.log('service worker is registered', reg))
    .catch((err) => console.log('service worker not registered', err))
}