const V='bookshelf-v1',SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const put=(r,x)=>{const c=x.clone();caches.open(V).then(h=>h.put(r,c));return x};
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);if(r.method!=='GET')return;
 const own=u.origin===location.origin,cdn=['cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com'].includes(u.hostname);
 if(!own&&!cdn)return;
 e.respondWith(own
  ?fetch(r).then(x=>put(r,x)).catch(()=>caches.match(r).then(m=>m||caches.match('./index.html')))
  :caches.match(r).then(m=>m||fetch(r).then(x=>put(r,x))))
});
