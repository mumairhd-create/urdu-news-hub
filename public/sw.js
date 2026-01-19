const CACHE_NAME = 'umar-media-v3';
const STATIC_CACHE_NAME = 'umar-media-static-v3';
const DYNAMIC_CACHE_NAME = 'umar-media-dynamic-v3';
const IMAGE_CACHE_NAME = 'umar-media-images-v3';

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/favicon.ico',
  '/site.webmanifest'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/articles',
  '/api/categories',
  '/api/search'
];

// Cache strategies
const cacheStrategies = {
  // Cache first for static assets
  cacheFirst: async (request, cacheName = STATIC_CACHE_NAME) => {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    try {
      const response = await fetch(request);
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      console.error('Cache first strategy failed:', error);
      throw error;
    }
  },

  // Network first for API calls
  networkFirst: async (request, cacheName = DYNAMIC_CACHE_NAME) => {
    const cache = await caches.open(cacheName);
    
    try {
      const response = await fetch(request);
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      console.log('Network failed, trying cache:', error);
      const cached = await cache.match(request);
      if (cached) {
        return cached;
      }
      throw error;
    }
  },

  // Stale while revalidate for content
  staleWhileRevalidate: async (request, cacheName = DYNAMIC_CACHE_NAME) => {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    const fetchPromise = fetch(request).then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    }).catch(error => {
      console.error('Fetch failed in stale while revalidate:', error);
    });

    if (cached) {
      // Trigger fetch in background
      fetchPromise;
      return cached;
    }

    return fetchPromise;
  },

  // Cache images with size limits
  cacheImage: async (request) => {
    const cache = await caches.open(IMAGE_CACHE_NAME);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    try {
      const response = await fetch(request);
      if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
        // Check cache size limit
        const cacheSize = await getCacheSize(IMAGE_CACHE_NAME);
        if (cacheSize > 50 * 1024 * 1024) { // 50MB limit
          await cleanupCache(IMAGE_CACHE_NAME, 0.5); // Remove 50% of oldest entries
        }
        
        cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      console.error('Image cache failed:', error);
      throw error;
    }
  }
};

// Helper functions
const getCacheSize = async (cacheName) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  let size = 0;
  
  for (const request of keys) {
    const response = await cache.match(request);
    if (response) {
      const blob = await response.blob();
      size += blob.size;
    }
  }
  
  return size;
};

const cleanupCache = async (cacheName, ratioToRemove = 0.3) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length === 0) return;
  
  // Sort by date (remove oldest)
  const keysWithDate = await Promise.all(
    keys.map(async (request) => {
      const response = await cache.match(request);
      const date = response?.headers.get('date') || new Date(0).toISOString();
      return { request, date: new Date(date).getTime() };
    })
  );
  
  keysWithDate.sort((a, b) => a.date - b.date);
  
  const toRemove = Math.floor(keys.length * ratioToRemove);
  for (let i = 0; i < toRemove; i++) {
    await cache.delete(keysWithDate[i].request);
  }
};

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache static assets:', error);
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName !== IMAGE_CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Old caches cleaned up');
        return self.clients.claim();
      })
      .catch((error) => {
        console.error('Cache cleanup failed:', error);
      })
  );
});

// Fetch event with routing
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip external requests (except images)
  if (url.origin !== self.location.origin && !url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
    return;
  }
  
  // Route to appropriate cache strategy
  if (STATIC_ASSETS.includes(url.pathname) || url.pathname.startsWith('/static/')) {
    // Static assets - cache first
    event.respondWith(cacheStrategies.cacheFirst(request, STATIC_CACHE_NAME));
  } else if (url.pathname.startsWith('/api/')) {
    // API calls - network first
    event.respondWith(cacheStrategies.networkFirst(request, DYNAMIC_CACHE_NAME));
  } else if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
    // Images - cache with size limits
    event.respondWith(cacheStrategies.cacheImage(request));
  } else if (url.pathname === '/' || url.pathname.startsWith('/article/') || url.pathname.startsWith('/articles')) {
    // Content pages - stale while revalidate
    event.respondWith(cacheStrategies.staleWhileRevalidate(request, DYNAMIC_CACHE_NAME));
  } else {
    // Default - network first
    event.respondWith(cacheStrategies.networkFirst(request, DYNAMIC_CACHE_NAME));
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

const doBackgroundSync = async () => {
  console.log('Background sync triggered');
  // Here you would sync any offline actions
  // For example: save offline articles, sync user preferences, etc.
};

// Push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || 1
      },
      actions: [
        {
          action: 'explore',
          title: 'Explore',
          icon: '/favicon.svg'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/favicon.svg'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_UPDATE') {
    // Force cache update for specific URL
    const url = event.data.url;
    if (url) {
      caches.open(DYNAMIC_CACHE_NAME).then(cache => {
        cache.delete(url);
      });
    }
  }
});
