/* global self, caches, fetch */
const APP_CACHE = "streamlist-app-v5";
const DATA_CACHE = "streamlist-data-v5";
const IMAGE_CACHE = "streamlist-img-v5";
const OFFLINE_URL = "/offline.html";
const APP_SHELL = ["/","/index.html","/manifest.json","/icons/icon-192.png","/icons/icon-256.png","/icons/icon-384.png","/icons/icon-512.png","/offline.html"];
const FAVORITES_QUEUE = "favorites-queue";

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const cache = await caches.open(APP_CACHE);
    await cache.addAll(APP_SHELL);
    await self.skipWaiting();
  })());
});
self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (![APP_CACHE, DATA_CACHE, IMAGE_CACHE].includes(k) && caches.delete(k))));
    await self.clients.claim();
  })());
});

const isImage = url => /\.(png|jpg|jpeg|gif|webp|svg)$/.test(url.pathname);
const isAPI = url => url.hostname.includes("tmdb.org") || url.pathname.startsWith("/api/");

self.addEventListener("fetch", e => {
  const r = e.request;
  const u = new URL(r.url);
  if (r.method === "POST" && u.pathname.startsWith("/api/favorites")) { e.respondWith(bgSyncPost(r)); return; }
  if (isImage(u)) { e.respondWith(cacheFirst(r, IMAGE_CACHE)); return; }
  if (isAPI(u)) { e.respondWith(staleWhileRevalidate(r, DATA_CACHE)); return; }
  if (r.mode === "navigate") { e.respondWith(networkFirstWithOfflineFallback(r)); return; }
});

async function cacheFirst(req, name){const c=await caches.open(name);const m=await c.match(req);if(m) return m;const res=await fetch(req);c.put(req,res.clone());return res;}
async function staleWhileRevalidate(req, name){const c=await caches.open(name);const m=await c.match(req);const p=fetch(req).then(res=>{c.put(req,res.clone());return res}).catch(()=>m||Promise.reject());return m||p;}
async function networkFirstWithOfflineFallback(req){try{const res=await fetch(req);const c=await caches.open(APP_CACHE);c.put(req,res.clone());return res}catch{const c=await caches.open(APP_CACHE);const m=await c.match(req);return m||(await caches.match(OFFLINE_URL));}}

async function bgSyncPost(req){try{return await fetch(req.clone())}catch{await self.registration.sync.register(FAVORITES_QUEUE);const body=await req.clone().text();await saveQueueItem({url:req.url,body,headers:[...req.headers],method:"POST"});return new Response(JSON.stringify({queued:true}),{status:202,headers:{"Content-Type":"application/json"}})}}
async function saveQueueItem(item){const c=await caches.open(FAVORITES_QUEUE);const key=new Request(`${FAVORITES_QUEUE}/${Date.now()}`);await c.put(key,new Response(JSON.stringify(item)))}
self.addEventListener("sync", e => { if (e.tag === FAVORITES_QUEUE) e.waitUntil(replayFavoritesQueue()); });
async function replayFavoritesQueue(){const c=await caches.open(FAVORITES_QUEUE);const ks=await c.keys();for (const k of ks){const r=await c.match(k);const it=await r.json();try{await fetch(it.url,{method:it.method,headers:Object.fromEntries(it.headers),body:it.body});await c.delete(k);}catch{}}}

self.addEventListener("push", e => {
  const d = e.data?.json() || { title: "StreamList", body: "New updates available." };
  e.waitUntil(self.registration.showNotification(d.title, { body: d.body, icon: "/icons/icon-192.png", badge: "/icons/icon-192.png" }));
});
