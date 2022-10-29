// "caches" not supported in IE
// if ("caches" in window) {
//   // the cache api is supported
//   // you can add your code here
// }

const cacheName = "v1";

const cacheAssets = [
  "/",
  "/index.html",
  "/about.html",
  "/css/style.css",
  "/js/main.js",
  "https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css",
  "https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&display=swap",
  "https://fonts.gstatic.com/s/inconsolata/v31/QlddNThLqRwH-OJ1UHjlKENVzkWGVkL3GZQmAwLyya15.woff2",
];

const addResourcesToCache = async (resources) => {
  const cache = await caches.open(cacheName);
  await cache.addAll(resources);
};

// cache assets
self.addEventListener("install", (event) => {
  event.waitUntil(addResourcesToCache(cacheAssets));
  console.log("service worker installed");
});

const deleteOldCaches = async () => {
  const cacheKeepList = [cacheName];
  const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));

  await Promise.all(cachesToDelete.map(deleteCache));
};

// do clean up (remove old caches)
self.addEventListener("activate", (event) => {
  event.waitUntil(deleteOldCaches());
});
