const CACHE_NAME = 'v1'
const urlsToCache = []

self.addEventListener('install', (_event) => {
  console.log('Service worker installed.')
})

self.addEventListener('fetch', async (event) => {
  event.respondWith(
    (async () => {
      try {
        // Try to fetch the resource from the network
        const networkResponse = await fetch(event.request)

        // Open the cache
        const cache = await caches.open(CACHE_NAME)

        // Clone the response so we can store it in the cache
        const responseClone = networkResponse.clone()

        // Store the fetched resource in the cache
        await cache.put(event.request, responseClone)

        // Return the network response
        return networkResponse
      } catch (error) {
        // If network request fails, try to serve from cache
        const cachedResponse = await caches.match(event.request)
        return (
          cachedResponse ||
          new Response('Offline and no cached data available', {
            status: 404,
          })
        )
      }
    })(),
  )
})

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName)
          }
        }),
      ),
    ),
  )
  console.log('Service worker activated.')
})
