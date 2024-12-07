const CACHE_NAME = "pwa-cache-v1"; // Update the cache version when assets change
const urlsToCache = [
  "/home.html", // Home page
    "/home.css", 
  "/about.html", // Example of a multi-page app
  "/addblog.html",
    "/blog.css", 
    "/blog.html",
    "/videochat.html",
      "/videochat.css", 
    "/login.html",
      "/auth.css", 
    "/signup.html",
    "/bible.html",
    "/bible.css",
    "/chapters.html",
    "/song.html",
    "/song.css",
     "/ai.html",
     "ai.css",
    "/verses.html",
  "/auth.js",
  "/home.js",
  "/authen.js",
    "/ai.js",
    "/song.js",
    "/chapter.js",
    "/verses.js",
    "/videochat.js",
    "/bible.js",
  "/manifest.json",
  "/icon.webp"
];

// Install event: Cache all essential assets
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event: Remove old caches if they exist
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log("Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event: Serve cached content when offline, fallback to network otherwise
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached response or fetch from network
      return (
        response ||
        fetch(event.request).then(fetchResponse => {
          // Optionally cache new requests for future use
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        })
      );
    }).catch(() => {
      // Fallback for offline errors
      if (event.request.mode === "navigate") {
        return caches.match("/offline.html"); // Create a fallback offline.html page
      }
    })
  );
});