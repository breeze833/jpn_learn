// 最簡單的 Service Worker，什麼都不做，只為了滿足 PWA 安裝條件
self.addEventListener('fetch', function(event) {
  // 這裡可以實作快取邏輯，但為了安裝，留空或直接 pass 請求也可以
  return; 
});
