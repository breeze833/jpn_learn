# 安裝與部署指南 (Installation Guide)

**繁體中文** | [English](INSTALL.md)

本專案設計理念為 **"Drop & Play"**，具備高度的環境適應性。
您可以根據需求，選擇從最簡單的「檔案直接開啟」，到完整的「Web Server + Proxy」部署模式。

-----

## 🚀 快速導覽：功能對照表

請依據您需要的功能，決定部署方式：

| 部署模式 | 執行方式 | 50音 | 句子解析 | 語音 (TTS) | PWA (安裝/離線) | 備註 |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **1. 極簡模式** | 雙擊 HTML 檔案 | ✅ | ✅ (需連網) | ✅ (部分瀏覽器) | ❌ | 適合快速體驗 |
| **2. 標準模式** | 靜態 Web Server | ✅ | **✅ (需字典檔)** | ✅ (部分瀏覽器) | ✅ | 推薦部署方式 |
| **+ 語音增強** | 加掛 Node.js Proxy| - | - | ✅✅ (更穩定) | - | 提供遠端語音快取 |

-----

## 1\. 極簡模式 (Local File Mode)

**適合：** 快速測試、個人單機使用。

不需要任何伺服器，直接利用瀏覽器開啟。

1.  下載專案中的 `jpn_learn.html`。
2.  直接雙擊檔案開啟。

> **⚠️ 注意事項：**
>
>   * **句子解析**：程式偵測到 `file://` 協定時，會自動切換至 **CDN 模式** 下載字典。請確保電腦已連上網際網路。
>   * **語音**：若您的瀏覽器不支援本地日語語音包，將嘗試連線 Google TTS。在某些瀏覽器嚴格設定下可能會因 CORS 而無聲。
>   * **PWA**：無法運作（Service Worker 不支援 `file://` 協定）。

-----

## 2\. 標準模式 (Static Web Server)

**適合：** 正式部署、架設於 GitHub Pages、NAS 或雲端空間。

支援完整 PWA 功能（可安裝至手機桌面、離線快取）。

### 步驟 A：準備伺服器與檔案

1.  將 `jpn_learn.html`, `jpn_learn_manifest.json`, `jpn_learn_sw.js` 及 icon 圖片放置於您的 Web Server 目錄下。
2.  **(重要)** 準備字典檔案（見步驟 B）。

### 步驟 B：下載與配置字典檔 (Dictionary)

在 Server 模式下，為了避免跨網域 (CORS) 錯誤，**必須將字典檔放置於 Server **，無法使用 CDN。

1.  **下載來源**：請至 kuromoji.js 的官方 GitHub 下載字典檔。
      * 連結：[kuromoji.js dict folder](https://github.com/takuyaa/kuromoji.js/tree/master/dict)
2.  **所需檔案**：請下載該目錄下所有的 `.dat.gz` 檔案 (共約 10 個檔案)。
3.  **放置位置**：在 `jpn_learn.html` 所在目錄下建立 `dict/` 資料夾，將檔案放入。

> **⚠️ 若未配置字典檔：**
> 程式載入字典會失敗（HTTP 404 ），導致\*\*「句子解析」與「逐詞朗讀」按鈕無法使用\*\*，但其他功能不受影響。

-----

## 3\. 語音增強外掛 (Optional TTS Proxy)

**適合：** 解決遠端 TTS 快取問題，提供更穩定的遠端語音合成。

無論您是使用「極簡模式」還是「標準模式」，都可以加掛此 Proxy 快取遠端語音。

### 安裝與啟動

1.  確保已安裝 **Node.js**。
2.  進入 `tts-proxy` 資料夾：
    ```bash
    cd tts-proxy
    npm install
    ```
3.  啟動 Proxy Server：
    ```bash
    node server.js
    ```
    *(預設 port 為 3000)*

### 運作原理

  * `jpn_learn.html` 啟動時會自動偵測 `http://localhost:3000/ready`。
  * 若偵測成功，所有遠端語音請求將自動轉發至 Proxy，提供遠端語音快取。

-----

## 🛠 常見問題排除 (Troubleshooting)

### Q1: 為什麼「逐詞朗讀」按鈕是灰色的 (Disabled)？

這代表**字典載入失敗**。

  * **Server 模式**：請按 F12 開啟 Console。若出現 404，代表 `dict/` 資料夾內無檔案(專案預設在 Server 模式下不使用 CDN 以避免此問題，請務必下載字典檔)。
  * **Local File 模式**：請檢查網路連線，程式需連線至 CDN 下載字典。

### Q2: 為什麼聽不到聲音？

請觀察頁面右上方的 **狀態指示燈**：

  * **綠燈 (Cached)**：讀取快取成功，若無聲請檢查喇叭。
  * **橘燈 (Remote)**：正在下載音訊。
      * 若一直轉圈或無聲，可能是瀏覽器安全性設定阻擋了直接對 Google 的請求。
      * **解法**：請啟動 Node.js Proxy (參閱第 3 節)，或改用 Chrome/Edge 等支援度較好的瀏覽器。

### Q3: 為什麼無法安裝 App (PWA)？

PWA 安裝條件較嚴格，請確認：

1.  網址必須是 `https://` (或 `http://localhost`)。
2.  `jpn_learn_manifest.json` 與 `jpn_learn_sw.js` 讀取正常 (可由 DevTools \> Application 頁籤檢查)。
