import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute} from 'workbox-routing'


// Clean old caches
cleanupOutdatedCaches()

// Default injection point for precaching
precacheAndRoute(self.__WB_MANIFEST)

// Work offline by default
registerRoute(new NavigationRoute(createHandlerBoundToURL('/')))

self.skipWaiting()
clientsClaim()
