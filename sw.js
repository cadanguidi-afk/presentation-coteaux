const C="coteaux-1795265501";
const SLIDES=["img/p1.jpg", "img/p2.jpg", "img/p3.jpg", "img/p4.jpg", "img/p5.jpg", "img/p6.jpg", "img/p7.jpg", "img/p8.jpg", "img/t1.jpg", "img/t2.jpg", "img/t3.jpg", "img/t4.jpg", "img/t5.jpg", "img/t6.jpg", "img/t7.jpg", "img/t8.jpg"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(["./","index.html","lecture/","lecture/index.html","lecture/read.js","common.js","common.css","data.js","img/logo.png"].concat(SLIDES))).catch(()=>{}));self.skipWaiting();});
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener("fetch",e=>{const u=new URL(e.request.url);if(e.request.method!=="GET"||u.origin!==location.origin)return;
 const img=/\.(jpg|png)$/.test(u.pathname),keep=x=>{const y=x.clone();caches.open(C).then(c=>c.put(e.request,y));return x;};
 e.respondWith(img?caches.match(e.request).then(r=>r||fetch(e.request).then(keep)):fetch(e.request).then(keep).catch(()=>caches.match(e.request)));});
