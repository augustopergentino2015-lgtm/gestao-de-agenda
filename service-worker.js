/**
 * service-worker.js
 * ============================================================
 * SERVICE WORKER — PWA com suporte offline
 *
 * Estratégia:
 *   - Cache First para assets estáticos (CSS, JS, fontes)
 *   - Network First para dados do Firebase (Firestore usa
 *     sua própria persistência offline)
 *   - Fallback para index.html em navegação (SPA)
 * ============================================================
 */

const CACHE_NAME    = "gestao-agenda-v1.0.0";
const CACHE_STATIC  = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/config.js",
  "/js/db.js",
  "/js/auth.js",
  "/js/profile.js",
  "/js/institutions.js",
  "/js/events.js",
  "/js/relatoria.js",
  "/js/ui.js",
  "/js/app.js",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// ---- INSTALL: pré-cache dos assets estáticos ----
self.addEventListener("install", (event) => {
  console.log("[SW] Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching static assets");
      return cache.addAll(CACHE_STATIC);
    })
  );
  self.skipWaiting();
});

// ---- ACTIVATE: limpa caches antigos ----
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating...");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => {
            console.log("[SW] Deleting old cache:", k);
            return caches.delete(k);
          })
      )
    )
  );
  self.clients.claim();
});

// ---- FETCH: Cache First para assets, Network First para resto ----
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignora requisições do Firebase / Google APIs (têm sua própria camada offline)
  if (
    url.hostname.includes("firebase") ||
    url.hostname.includes("googleapis") ||
    url.hostname.includes("gstatic") ||
    url.hostname.includes("fonts.g")
  ) {
    return; // deixa o browser lidar normalmente
  }

  // Cache First para assets estáticos
  if (
    request.method === "GET" &&
    (url.pathname.match(/\.(css|js|png|jpg|svg|ico|woff2?)$/) ||
     url.pathname === "/" ||
     url.pathname === "/index.html")
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (!response || response.status !== 200) return response;
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        });
      })
    );
    return;
  }

  // Network First com fallback para index.html (navegação SPA)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/index.html"))
    );
    return;
  }
});

// ---- SYNC: Background sync para lançamentos offline ----
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-events") {
    console.log("[SW] Background sync: events");
    // O Firestore SDK cuida da persistência offline automaticamente.
    // Este handler é um ponto de extensão para lógica customizada futura.
    event.waitUntil(Promise.resolve());
  }
});

// ---- PUSH NOTIFICATIONS (estrutura para ativação futura) ----
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  const title   = data.title   || "Gestão de Agenda";
  const options = {
    body:    data.body    || "Você tem um lembrete.",
    icon:    "/icons/icon-192.png",
    badge:   "/icons/icon-192.png",
    vibrate: [200, 100, 200],
    data:    { url: data.url || "/" }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || "/")
  );
});
