# 日語學習助手 - 技術文件

**繁體中文** | [English](TECH.md)

## 1. 專案概述 (Project Overview)

本專案為一個 **漸進式網頁應用程式 (Progressive Web App, PWA)**，採用 **單頁應用 (SPA)** 架構開發。

專案旨在提供日語 50 音記憶與句子解析功能。設計上強調 **"Installable & Offline-First"**，透過 Service Worker 實現離線存取能力，並利用瀏覽器原生 API (Web Speech API, IndexedDB) 最小化對後端的依賴，實現輕量化部署。

* **類型**: PWA / SPA
* **核心特性**: 離線支援 (Service Worker)、可安裝 (Manifest)、客戶端渲染 (CSR)。

## 2\. 技術堆疊 (Tech Stack)

### 核心技術

  * **HTML5 / CSS3**: 使用 CSS Variables 定義主題，Flexbox 與 CSS Grid 處理響應式佈局 (RWD)。
  * **JavaScript (ES6+)**: 不依賴前端框架 (Vue/React)，採用原生 JS 進行 DOM 操作與邏輯控制。
  * **PWA (Progressive Web App)**: 包含 `manifest.json` 連結與 Service Worker 註冊邏輯 (支援離線存取與安裝)。

### 外部依賴與 API

  * **Kuromoji.js**: 用於瀏覽器端的日語形態素解析 (Tokenizer)。
  * **Google Translate TTS API** (非官方): 用於遠端語音合成 (Fallback)。
  * **Wikimedia Commons API**: 用於動態獲取 50 音筆順 GIF 動畫。
  * **IndexedDB**: 用於快取遠端語音檔案 (Blobs)，減少網路請求。

-----

## 3\. 系統架構與模組設計

程式碼採用 **單例模式 (Singleton Pattern)** 組織主要功能模組，確保全域狀態管理的一致性。

### 3.1. AudioManager (語音核心模組)

這是本專案最複雜的模組，負責處理所有發音請求。

  * **混合式語音策略 (Hybrid TTS Strategy)**:
    1.  **優先 (Local)**: 偵測 `window.speechSynthesis` (Web Speech API)。若瀏覽器/作業系統支援日語語音包 (`ja-JP`)，優先使用本地引擎，零延遲且無須網路。
    2.  **備援 (Remote)**: 若無本地語音，則切換至遠端模式。
  * **遠端代理與快取機制**:
      * **Proxy Detection**: 啟動時偵測 `http://localhost:3000`。若存在，通過 Proxy 繞過 CORS 限制存取 Google TTS。
      * **Direct Fallback**: 若無 Proxy，嘗試直接請求 Google Translate TTS 介面 (Client-tw-ob)。
      * **IndexedDB Caching**: 實作 `JP_TTS_Cache` 資料庫。
          * 將下載的音訊轉為 `Blob` 儲存。
          * 再次請求相同文字時，直接從 DB 讀取 Blob 並轉為 ObjectURL 播放，大幅優化效能。
  * **並發控制**: 透過 `currentPlayId` 處理非同步競爭條件 (Race Conditions)，防止快速切換播放時聲音重疊。

### 3.2. KanaApp (50音學習模組)

負責 50 音圖表的渲染與互動。

  * **資料結構**: 使用靜態 Array 儲存平/片假名、羅馬拼音及記憶口訣，支援切換顯示模式。
  * **動態資源獲取**:
      * 不預先打包筆順圖片，而是點擊卡片時，即時呼叫 `Wikimedia API` 查詢 `File:Hiragana_{char}_stroke_order_animation.gif`。
      * 解決了靜態資源過大問題，但需處理 CORS 與載入狀態 (Loader/Error Handling)。

### 3.3. SentenceApp (句子解析模組)

負責將長句拆解並標註發音。

  * **字典載入策略**:
      * **環境偵測**: 自動判斷是 `file:` 協定還是 `http` 協定。
      * **路徑切換**: 伺服模式時嘗試讀取 `dict/`，CDN 模式下讀取 `jsdelivr` 的 Kuromoji 字典檔。
  * **DOM 生成與互動**:
      * 解析後生成 `<span class="token">`，內嵌 `<ruby><rt>` 標籤顯示讀音 (Furigana)。
      * **逐詞播放 (Sequencer)**: 實作遞迴 `setTimeout` 邏輯，依序高亮並播放每個 Token，模擬朗讀效果。

-----

## 4\. 關鍵實作細節

### 4.1. 語音快取層 (IndexedDB Wrapper)

`AudioManager.cache` 物件封裝了底層 IDB 操作：

```javascript
// 簡化的邏輯示意
async get(text) {
    // 1. 開啟 IndexedDB
    // 2. 搜尋 Key 為 text 的資料
    // 3. 若存在，更新 timestamp (LRU 預備)，回傳 Blob
}
```

### 4.2. 解決 Android Chrome 語音包載入延遲

在 `AudioManager.init()` 中，針對 Android 裝置語音包動態載入的特性，實作了 **雙重檢查機制**：

1.  註冊 `onvoiceschanged` 事件。
2.  設置 2.5 秒的 `setTimeout` 強制檢查，避免事件未觸發導致 UI 永遠卡在「偵測中」。

### 4.3. 形態素解析與標音

利用 `kuromoji` 輸出的 `surface_form` (表層形) 與 `reading` (讀音-片假名) 進行比對：

  * 若兩者相同 (如「スミス」)，不顯示振假名。
  * 將片假名讀音轉換為平假名 (利用 Unicode 偏移量 `0x60`) 顯示於 `<rt>` 標籤中。

-----

## 5\. UI/UX 實作技巧

  * **CSS 變數系統**: 定義 `--primary`, `--primary-kana` 等變數，方便未來實作深色模式或更換主題色。
  * **狀態指示燈**: Header 上的指示燈 (綠/橘/灰) 真實反映了當前音訊來源 (Cache/Remote/Idle) 與網路狀態。
  * **純 CSS Tabs**: 利用 `.active` class 與 `display: none/block` 切換視圖，無路由依賴。

## 6\. 已知限制與未來優化

1.  **CORS 問題**: 直接呼叫 Google TTS API 可能在某些嚴格的瀏覽器環境下失敗，建議搭配後端 Proxy (`server.js`) 使用。
2.  **字典大小**: Kuromoji 字典檔約數十 MB，初次載入需時較長。目前已實作 CDN 加速，但可考慮 Service Worker 快取字典檔。
3.  **Safari 相容性**: 雖然使用了標準 Web Speech API，但在 iOS Safari 上可能需要使用者手動觸發第一次播放才能解鎖音訊環境 (已透過按鈕互動解決部分問題)。

-----

## 7\. 部署說明

由於是純靜態檔案，一般部署方式：

1.  將 `jpn_learn.html` 放置於任何 Web Server (Nginx, Apache, GitHub Pages)。
2.  (選用) 啟動本地 Node.js Proxy (`node server.js`) 以獲得更穩定的 TTS 體驗。
3.  開啟瀏覽器存取即可。
