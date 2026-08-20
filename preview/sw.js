const CACHE='elbi-pass1-5-v1';
const STATIC=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./assets/campus_hero.png','./assets/ui/settings.png','./assets/campus-atlas.png','./assets/campus-atlas.json','./assets/scene_home.json','./assets/icon-192.png','./assets/icon-512.png','./assets/audio/rainy-elbi.ogg','./assets/audio/night-insects.ogg','./assets/audio/quiet-room.ogg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(STATIC)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))))});
