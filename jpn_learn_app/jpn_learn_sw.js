// The simplest Service Worker. It does nothing, only for satifying PWA specification
self.addEventListener('fetch', function(event) {
  // can do something such as caching
  return; 
});
