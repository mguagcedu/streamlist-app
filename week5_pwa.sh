#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="${1:-$PWD}"

echo "Repo dir: $REPO_DIR"
cd "$REPO_DIR"

# Basic check
if [ ! -f package.json ]; then
  echo "package.json not found in $REPO_DIR. Run from project root or pass path."
  exit 1
fi

# Ensure git repo
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not a git repo. Initializing git."
  git init
  git add .
  git commit -m "Init repo"
fi

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD || echo main)"
NEW_BRANCH="week5-pwa"

# ---------- Backup without rsync ----------
STAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_DIR="$(dirname "$REPO_DIR")/backup_week4_${STAMP}"
echo "Creating backup at: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# Prefer tar if available (fast, preserves structure, skips node_modules/.git)
if command -v tar >/dev/null 2>&1; then
  tar --exclude='./node_modules' --exclude='./.git' -cf "${BACKUP_DIR}.tar" .
  echo "Backup tar created: ${BACKUP_DIR}.tar"
else
  # Fallback to cp -r (skip node_modules and .git)
  mkdir -p "${BACKUP_DIR}"
  # Copy everything except node_modules and .git
  find . -maxdepth 1 -mindepth 1 ! -name 'node_modules' ! -name '.git' -exec cp -r {} "${BACKUP_DIR}/" \;
  echo "Backup folder created: ${BACKUP_DIR}"
fi
# -----------------------------------------

# Create or switch to branch
git checkout -b "$NEW_BRANCH" 2>/dev/null || git checkout "$NEW_BRANCH"

# Ensure dirs
mkdir -p public/icons
mkdir -p src

# Tiny 1x1 png placeholders for icons
BASE64_PNG='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/abYp6sAAAAASUVORK5CYII='
for SIZE in 192 256 384 512; do
  printf '%s' "$BASE64_PNG" | base64 -d > "public/icons/icon-${SIZE}.png"
done

# manifest.json
cat > public/manifest.json <<'JSON'
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

# offline.html
cat > public/offline.html <<'HTML'
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>StreamList Offline</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>
      body { font-family: system-ui, Arial; padding: 24px; color: #111827; background: #f9fafb; }
      .card { max-width: 520px; margin: 10vh auto 0; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; background: #fff; }
      .muted { color: #6b7280; }
      .btn { display:inline-block; margin-top:12px; padding:10px 14px; border-radius:10px; border:1px solid #0ea5e9; }
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

# Service worker (public/sw.js so path is simple)
cat > public/sw.js <<'SW'
/* global self, caches, fetch */
const APP_CACHE = "streamlist-app-v5";
const DATA_CACHE = "streamlist-data-v5";
const IMAGE_CACHE = "streamlist-img-v5";
const OFFLINE_URL = "/offline.html";
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-256.png",
  "/icons/icon-384.png",
  "/icons/icon-512.png",
  "/offline.html"
];

const FAVORITES_QUEUE = "favorites-queue";

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(APP_CACHE);
    await cache.addAll(APP_SHELL);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.map(k => {
        if (![APP_CACHE, DATA_CACHE, IMAGE_CACHE].includes(k)) return caches.delete(k);
      })
    );
    await self.clients.claim();
  })());
});

const isImage = url => /\.(png|jpg|jpeg|gif|webp|svg)$/.test(url.pathname);
const isAPI = url => url.hostname.includes("tmdb.org") || url.pathname.startsWith("/api/");

self.addEventListener("fetch", event => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method === "POST" && url.pathname.startsWith("/api/favorites")) {
    event.respondWith(bgSyncPost(request));
    return;
  }

  if (isImage(url)) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  if (isAPI(url)) {
    event.respondWith(staleWhileRevalidate(request, DATA_CACHE));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }
});

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const res = await fetch(request);
  cache.put(request, res.clone());
  return res;
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then(res => {
      cache.put(request, res.clone());
      return res;
    })
    .catch(() => cached || Promise.reject());
  return cached || networkPromise;
}

async function networkFirstWithOfflineFallback(request) {
  try {
    const res = await fetch(request);
    const cache = await caches.open(APP_CACHE);
    cache.put(request, res.clone());
    return res;
  } catch {
    const cache = await caches.open(APP_CACHE);
    const cached = await cache.match(request);
    return cached || (await caches.match(OFFLINE_URL));
  }
}

async function bgSyncPost(request) {
  try {
    return await fetch(request.clone());
  } catch {
    await self.registration.sync.register("favorites-queue");
    const body = await request.clone().text();
    await saveQueueItem({ url: request.url, body, headers: [...request.headers], method: "POST" });
    return new Response(JSON.stringify({ queued: true }), { status: 202, headers: { "Content-Type": "application/json" } });
  }
}

async function saveQueueItem(item) {
  const cache = await caches.open("favorites-queue");
  const key = new Request(`favorites-queue/${Date.now()}`);
  await cache.put(key, new Response(JSON.stringify(item)));
}

self.addEventListener("sync", event => {
  if (event.tag === "favorites-queue") {
    event.waitUntil(replayFavoritesQueue());
  }
});

async function replayFavoritesQueue() {
  const cache = await caches.open("favorites-queue");
  const keys = await cache.keys();
  for (const req of keys) {
    const res = await cache.match(req);
    const item = await res.json();
    try {
      await fetch(item.url, {
        method: item.method,
        headers: Object.fromEntries(item.headers),
        body: item.body
      });
      await cache.delete(req);
    } catch { /* keep for next sync */ }
  }
}

self.addEventListener("push", event => {
  const data = event.data?.json() || { title: "StreamList", body: "New updates available." };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png"
    })
  );
});
SW

# sw register helper
cat > src/sw-register.js <<'JS'
export function registerSW() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    });
  }
}
JS

# simple install button injected at runtime
cat > public/pwa-install.js <<'JS'
(function () {
  let deferredPrompt = null;
  const ensureBtn = () => {
    let btn = document.getElementById("installBtn");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "installBtn";
      btn.textContent = "Install StreamList";
      btn.style.cssText = "position:fixed;right:16px;bottom:16px;display:none;padding:10px 14px;border-radius:10px;border:1px solid #0ea5e9;background:#fff;cursor:pointer;z-index:9999;";
      document.body.appendChild(btn);
    }
    return btn;
  };
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    deferredPrompt = e;
    const btn = ensureBtn();
    btn.style.display = "inline-flex";
    btn.onclick = async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      btn.style.display = "none";
    };
  });
})();
JS

# Inject manifest + theme-color + pwa-install loader
if [ -f index.html ]; then
  if ! grep -q 'rel="manifest"' index.html; then
    sed -i 's#</head>#  <link rel="manifest" href="/manifest.json">\n  <meta name="theme-color" content="#0ea5e9">\n</head>#' index.html
  fi
  if ! grep -q 'pwa-install.js' index.html; then
    sed -i 's#</body>#  <script src="/pwa-install.js"></script>\n</body>#' index.html
  fi
else
  echo "index.html not found. If Vite moved it, update the script manually."
fi

# Wire registerSW() into the React entry
MAIN_JSX=""
for CAND in src/main.jsx src/main.tsx src/index.jsx src/index.tsx; do
  if [ -f "$CAND" ]; then MAIN_JSX="$CAND"; break; fi
done
if [ -n "$MAIN_JSX" ]; then
  if ! grep -q 'registerSW' "$MAIN_JSX"; then
    awk 'NR==1{print; print "import { registerSW } from \"./sw-register.js\";"; next}1' "$MAIN_JSX" > "$MAIN_JSX.tmp" && mv "$MAIN_JSX.tmp" "$MAIN_JSX"
    if grep -q 'ReactDOM\.createRoot' "$MAIN_JSX"; then
      sed -i 's#ReactDOM\.createRoot#registerSW();\nReactDOM.createRoot#' "$MAIN_JSX"
    elif grep -q 'createRoot' "$MAIN_JSX"; then
      sed -i 's#createRoot#registerSW();\ncreateRoot#' "$MAIN_JSX"
    else
      printf '\nregisterSW();\n' >> "$MAIN_JSX"
    fi
  fi
else
  echo "Could not find React entry in src/. Add registerSW() manually."
fi

# Install and build if possible
if command -v npm >/dev/null 2>&1; then
  if [ -f package-lock.json ]; then npm ci || npm install; else npm install; fi
  npm run build || true
fi

# Commit and push
git add .
git commit -m "Week 5: PWA upgrade with manifest, service worker, offline page, install prompt, registration" || true

# Ensure remote and push branch
if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin "https://github.com/mguagcedu/streamlist-app.git"
fi
git checkout -B "$NEW_BRANCH"
git push -u origin "$NEW_BRANCH"

echo "Done."
echo "Next:"
echo "  npm run preview   # Test install and offline"
echo "  Record your video"
