# Japanese Learning Assistant - Technical Documentation

[繁體中文](TECH.zh-TW.md) | **English**

## 1\. Project Overview

This project is a **Progressive Web App (PWA)** developed using a **Single Page Application (SPA)** architecture.

The project aims to provide Japanese 50-sound (Kana) memorization and sentence parsing capabilities. The design emphasizes an **"Installable & Offline-First"** philosophy, utilizing Service Workers to achieve offline access, and leveraging browser-native APIs (Web Speech API, IndexedDB) to minimize backend dependencies for a lightweight deployment.

  * **Type**: PWA / SPA
  * **Core Features**: Offline support (Service Worker), Installable (Manifest), Client-Side Rendering (CSR).

## 2\. Tech Stack

### Core Technologies

  * **HTML5 / CSS3**: Uses CSS Variables for theming, and Flexbox & CSS Grid for Responsive Web Design (RWD).
  * **JavaScript (ES6+)**: No dependency on frontend frameworks (Vue/React); uses native (Vanilla) JS for DOM manipulation and logic control.
  * **PWA (Progressive Web App)**: Includes `manifest.json` linking and Service Worker registration logic (supporting offline access and installation).

### External Dependencies & APIs

  * **Kuromoji.js**: Used for client-side Japanese morphological analysis (Tokenizer).
  * **Google Translate TTS API** (Unofficial): Used for remote speech synthesis (Fallback).
  * **Wikimedia Commons API**: Used to dynamically fetch stroke order GIF animations for the 50 sounds.
  * **IndexedDB**: Used to cache remote audio files (Blobs) to reduce network requests.

-----

## 3\. System Architecture & Module Design

The code employs the **Singleton Pattern** to organize main functional modules, ensuring consistent global state management.

### 3.1. AudioManager (Core Speech Module)

This is the most complex module in the project, responsible for handling all pronunciation requests.

  * **Hybrid TTS Strategy**:
    1.  **Priority (Local)**: Detects `window.speechSynthesis` (Web Speech API). If the browser/OS supports a Japanese voice package (`ja-JP`), it prioritizes the local engine (zero latency, no network required).
    2.  **Fallback (Remote)**: If no local voice is available, it switches to remote mode.
  * **Remote Proxy & Caching Mechanism**:
      * **Proxy Detection**: Detects `http://localhost:3000` on startup. If present, it uses the Proxy to bypass CORS restrictions when accessing Google TTS.
      * **Direct Fallback**: If no Proxy is found, it attempts to request the Google Translate TTS interface (Client-tw-ob) directly.
      * **IndexedDB Caching**: Implements a `JP_TTS_Cache` database.
          * Downloads audio and saves it as a `Blob`.
          * When the same text is requested again, it reads the Blob directly from the DB and plays it via ObjectURL, significantly optimizing performance.
  * **Concurrency Control**: Uses `currentPlayId` to handle asynchronous race conditions, preventing audio overlap when switching playback quickly.

### 3.2. KanaApp (50-Sound Learning Module)

Responsible for rendering the 50-sound chart and handling interactions.

  * **Data Structure**: Uses static Arrays to store Hiragana/Katakana, Romaji, and mnemonics, supporting display mode switching.
  * **Dynamic Resource Fetching**:
      * Does not pre-bundle stroke order images. Instead, it calls the `Wikimedia API` to query `File:Hiragana_{char}_stroke_order_animation.gif` on demand when a card is clicked.
      * This solves the issue of large static resource sizes but requires handling CORS and loading states (Loader/Error Handling).

### 3.3. SentenceApp (Sentence Parsing Module)

Responsible for breaking down long sentences and annotating pronunciation.

  * **Dictionary Loading Strategy**:
      * **Environment Detection**: Automatically determines if the protocol is `file:` or `http`.
      * **Path Switching**: Attempts to read from `dict/` in Server mode, and reads the Kuromoji dictionary file from `jsdelivr` in CDN mode.
  * **DOM Generation & Interaction**:
      * Generates `<span class="token">` after parsing, embedding `<ruby><rt>` tags to display readings (Furigana).
      * **Sequencer**: Implements recursive `setTimeout` logic to sequentially highlight and play each token, simulating a reading-aloud effect.

-----

## 4\. Key Implementation Details

### 4.1. Audio Cache Layer (IndexedDB Wrapper)

The `AudioManager.cache` object encapsulates low-level IDB operations:

```javascript
// Simplified logic illustration
async get(text) {
    // 1. Open IndexedDB
    // 2. Search for data where Key is text
    // 3. If exists, update timestamp (for LRU prep), return Blob
}
```

### 4.2. Resolving Android Chrome Voice Load Delay

In `AudioManager.init()`, a **double-check mechanism** is implemented to address the dynamic loading characteristic of voice packages on Android devices:

1.  Register the `onvoiceschanged` event.
2.  Set a 2.5-second `setTimeout` forced check to prevent the UI from getting stuck in "Detecting..." if the event fails to trigger.

### 4.3. Morphological Analysis & Phonetic Notation

Utilizes the `surface_form` (surface text) and `reading` (reading - Katakana) output from `kuromoji` for comparison:

  * If both are identical (e.g., "スミス"), Furigana is not displayed.
  * Converts Katakana readings to Hiragana (using Unicode offset `0x60`) for display in the `<rt>` tag.

-----

## 5\. UI/UX Implementation Techniques

  * **CSS Variable System**: Defines `--primary`, `--primary-kana`, etc., facilitating future implementation of dark mode or theme color changes.
  * **Status Indicators**: Indicators on the Header (Green/Orange/Gray) reflect the current audio source (Cache/Remote/Idle) and network status in real-time.
  * **Pure CSS Tabs**: Uses `.active` class and `display: none/block` to switch views without routing dependencies.

## 6\. Known Limitations & Future Optimizations

1.  **CORS Issues**: Direct calls to Google TTS API may fail in strict browser environments; using a backend Proxy (`server.js`) is recommended.
2.  **Dictionary Size**: The Kuromoji dictionary is roughly tens of MBs, taking time to load initially. CDN acceleration is currently implemented, but caching the dictionary via Service Worker could be considered.
3.  **Safari Compatibility**: While standard Web Speech API is used, iOS Safari may require a manual user trigger for the first playback to unlock the audio environment (partially resolved via button interactions).

-----

## 7\. Deployment Instructions

Since it consists of pure static files, standard deployment methods apply:

1.  Place `jpn_learn.html` on any Web Server (Nginx, Apache, GitHub Pages).
2.  (Optional) Start the local Node.js Proxy (`node server.js`) for a more stable TTS experience.
3.  Open the browser to access.
