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

// service worker navigation preload
const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    // enable navigation preloads!
    await self.registration.navigationPreload.enable();
  }
};

self.addEventListener("activate", (event) => {
  event.waitUntil(enableNavigationPreload());
});

const putInCache = async (request, response) => {
  const cache = await caches.open(cacheName);
  await cache.put(request, response);
};

// check in cache if not found fetch over network
const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
  // first try to get the resource from the cache
  const responseFromCache = await caches.match(request);
  // cache.match(event.request, { ignoreSearch: true }))
  if (responseFromCache) {
    // we found an entry in the cache!
    return responseFromCache;
  }

  // next try to use (and cache) the preloaded response, if it's there
  const preloadResponse = await preloadResponsePromise;

  if (preloadResponse) {
    console.info("using preload response", preloadResponse);
    putInCache(request, preloadResponse.clone());
    return preloadResponse;
  }

  try {
    // next try to get the resource from the network

    const responseFromNetwork = await fetch(request);

    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);

    if (fallbackResponse) {
      return fallbackResponse;
    }

    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
};

// listen for a fetch event to provide the user a cached resource
// the next time a page from our site is accessed
self.addEventListener("fetch", (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      fallbackUrl: "/gallery/myLittleVader.jpg",
    })
  );

  console.log("service worker fetching");
});
