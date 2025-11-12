#!/usr/bin/env bash
set -euo pipefail

echo "== Week 5 fixer started =="
[ -f package.json ] || { echo "package.json not found; run from project root."; exit 1; }

# Ensure branch
git rev-parse --abbrev-ref HEAD >/dev/null 2>&1 || { git init && git add . && git commit -m "Init repo"; }
git checkout -B week5-pwa

# Ensure public paths
mkdir -p public/icons

# 1) Make sure core PWA files exist (do not overwrite if already present)
[ -f public/manifest.json ] || cat > public/manifest.json <<'JSON'
{
  "name": "StreamList",
  "short_name": "StreamList",
  "description": "EZTechMovie customer user events and watchlist PWA.",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#111827",
  "theme_color": "#0ea5e9",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-256.png", "sizes": "256x256", "type": "image/png" },
    { "src": "/icons/icon-384.png", "sizes": "384x384", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
JSON

# tiny placeholder icons if missing
BASE64_PNG='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/abYp6sAAAAASUVORK5CYII='
for s in 192 256 384 512; do
  [ -f "public/icons/icon-$s.png" ] || printf '%s' "$BASE64_PNG" | base64 -d > "public/icons/icon-$s.png"
done

[ -f public/offline.html ] || cat > public/offline.html <<'HTML'
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>StreamList Offline</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    body { font-family: system-ui, Arial; padding:24px; color:#111827; background:#f9fafb; }
    .card { max-width:520px; margin:10vh auto 0; border:1px solid #e5e7eb; border-radius:12px; padding:24px; background:#fff; }
    .muted { color:#6b7280; }
    .btn { display:inline-block; margin-top:12px; padding:10px 14px; border-radius:10px; border:1px solid #0ea5e9; text-decoration:none; }
  </style>
</head>
<body>
  <div class="card">
    <h1>You are offline</h1>
    <p class="muted">StreamList is unavailable right now. Try again when you are online.</p>
    <a class="btn" href="/">Go home</a>
  </div>
</body>
</html>
HTML

[ -f public/sw.js ] || cat > public/sw.js <<'SW'
const APP_CACHE="streamlist-app-v5",DATA_CACHE="streamlist-data-v5",IMAGE_CACHE="streamlist-img-v5",OFFLINE_URL="/offline.html",APP_SHELL=["/","/index.html","/manifest.json","/icons/icon-192.png","/icons/icon-256.png","/icons/icon-384.png","/icons/icon-512.png","/offline.html"],FAVORITES_QUEUE="favorites-queue";
self.addEventListener("install",e=>{e.waitUntil((async()=>{const c=await caches.open(APP_CACHE);await c.addAll(APP_SHELL);await self.skipWaiting()})())});
self.addEventListener("activate",e=>{e.waitUntil((async()=>{const k=await caches.keys();await Promise.all(k.map(x=>![APP_CACHE,DATA_CACHE,IMAGE_CACHE].includes(x)&&caches.delete(x)));await self.clients.claim()})())});
const isImage=u=>/\.(png|jpg|jpeg|gif|webp|svg)$/.test(u.pathname),isAPI=u=>u.hostname.includes("tmdb.org")||u.pathname.startsWith("/api/");
self.addEventListener("fetch",e=>{const r=e.request,u=new URL(r.url);if(r.method==="POST"&&u.pathname.startsWith("/api/favorites")){e.respondWith(bgSyncPost(r));return}
if(isImage(u)){e.respondWith(cacheFirst(r,IMAGE_CACHE));return}
if(isAPI(u)){e.respondWith(staleWhileRevalidate(r,DATA_CACHE));return}
if(r.mode==="navigate"){e.respondWith(networkFirstWithOfflineFallback(r));return}});
async function cacheFirst(req,name){const c=await caches.open(name),m=await c.match(req);if(m) return m;const res=await fetch(req);c.put(req,res.clone());return res}
async function staleWhileRevalidate(req,name){const c=await caches.open(name),m=await c.match(req);const p=fetch(req).then(res=>{c.put(req,res.clone());return res}).catch(()=>m||Promise.reject());return m||p}
async function networkFirstWithOfflineFallback(req){try{const res=await fetch(req),c=await caches.open(APP_CACHE);c.put(req,res.clone());return res}catch{const c=await caches.open(APP_CACHE),m=await c.match(req);return m||(await caches.match(OFFLINE_URL))}}
async function bgSyncPost(req){try{return await fetch(req.clone())}catch{await self.registration.sync.register(FAVORITES_QUEUE);const body=await req.clone().text();await saveQueueItem({url:req.url,body,headers:[...req.headers],method:"POST"});return new Response(JSON.stringify({queued:true}),{status:202,headers:{"Content-Type":"application/json"}})}}
async function saveQueueItem(item){const c=await caches.open(FAVORITES_QUEUE),key=new Request(`${FAVORITES_QUEUE}/${Date.now()}`);await c.put(key,new Response(JSON.stringify(item)))}
self.addEventListener("sync",e=>{if(e.tag===FAVORITES_QUEUE)e.waitUntil(replayFavoritesQueue())});
async function replayFavoritesQueue(){const c=await caches.open(FAVORITES_QUEUE),ks=await c.keys();for(const k of ks){const r=await c.match(k),it=await r.json();try{await fetch(it.url,{method:it.method,headers:Object.fromEntries(it.headers),body:it.body});await c.delete(k)}catch{}}}
SW

[ -f public/pwa-install.js ] || cat > public/pwa-install.js <<'JS'
(function () {
  let deferredPrompt=null;
  function ensureBtn(){
    let btn=document.getElementById("installBtn");
    if(!btn){
      btn=document.createElement("button");
      btn.id="installBtn";
      btn.textContent="Install StreamList";
      btn.style.cssText="position:fixed;right:16px;bottom:16px;display:none;padding:10px 14px;border-radius:10px;border:1px solid #0ea5e9;background:#fff;cursor:pointer;z-index:9999;";
      document.body.appendChild(btn);
    }
    return btn;
  }
  window.addEventListener("beforeinstallprompt",e=>{
    e.preventDefault(); deferredPrompt=e;
    const btn=ensureBtn(); btn.style.display="inline-flex";
    btn.onclick=async()=>{ if(!deferredPrompt) return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; btn.style.display="none"; };
  });
})();
JS

# 2) Inject <link rel="manifest"> + theme-color using awk (avoids MSYS sed issues)
if [ -f index.html ]; then
  if ! grep -q 'rel="manifest"' index.html; then
    awk 'BEGIN{added=0}
      /<\/head>/ && added==0 {
        print "  <link rel=\"manifest\" href=\"/manifest.json\">"
        print "  <meta name=\"theme-color\" content=\"#0ea5e9\">"
        added=1
      }
      {print}
    ' index.html > index.html.__tmp && mv index.html.__tmp index.html
    echo "Injected manifest + theme-color into index.html"
  fi

  if ! grep -q 'pwa-install.js' index.html; then
    awk 'BEGIN{added=0}
      /<\/body>/ && added==0 {
        print "  <script src=\"/pwa-install.js\"></script>"
        added=1
      }
      {print}
    ' index.html > index.html.__tmp && mv index.html.__tmp index.html
    echo "Injected pwa-install loader into index.html"
  fi
else
  echo "index.html not found; skip tag injection."
fi

# 3) Ensure SW registration in React entry
mkdir -p src
[ -f src/sw-register.js ] || cat > src/sw-register.js <<'JS'
export function registerSW(){ if("serviceWorker" in navigator){ window.addEventListener("load",()=>{ navigator.serviceWorker.register("/sw.js").catch(()=>{}); }); } }
JS

ENTRY=""
for f in src/main.jsx src/main.tsx src/index.jsx src/index.tsx; do
  [ -f "$f" ] && ENTRY="$f" && break
done

if [ -n "${ENTRY}" ]; then
  if ! grep -q 'registerSW' "$ENTRY"; then
    awk 'NR==1{print; print "import { registerSW } from \"./sw-register.js\";"; next}1' "$ENTRY" > "$ENTRY.__tmp" && mv "$ENTRY.__tmp" "$ENTRY"
    # Insert call just before createRoot if possible
    if grep -q 'ReactDOM\.createRoot' "$ENTRY"; then
      sed -i 's/ReactDOM\.createRoot/registerSW();\
ReactDOM.createRoot/' "$ENTRY"
    elif grep -q 'createRoot' "$ENTRY"; then
      sed -i 's/createRoot/registerSW();\
createRoot/' "$ENTRY"
    else
      printf '\nregisterSW();\n' >> "$ENTRY"
    fi
    echo "Wired service worker registration in ${ENTRY}"
  fi
else
  echo "React entry not found; add registerSW() manually later."
fi

# 4) Commit and push
git add .
git commit -m "Week 5 fix: inject manifest/theme-color, loader; ensure PWA files and SW registration" || true
git push -u origin week5-pwa

echo "== Week 5 fixer finished =="
echo "Next:"
echo "  npm run preview   # open in Chrome, click Install button, test offline"
