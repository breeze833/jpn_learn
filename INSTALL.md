# Installation & Deployment Guide

[繁體中文](INSTALL.zh-TW.md) | **English**

The design philosophy of this project is **"Drop & Play"**, featuring high adaptability to different environments.
Depending on your needs, you can choose from the simplest "Direct File Opening" to a full "Web Server + Proxy" deployment mode.

-----

## 🚀 Quick Start: Feature Matrix

Please decide on a deployment method based on the features you need:

| Deployment Mode | Execution Method | 50-Sounds | Sentence Parse | Voice (TTS) | PWA (Install/Offline) | Remarks |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **1. Minimalist Mode** | Double-click HTML file | ✅ | ✅ (Internet Required) | ✅ (Browser Dependent) | ❌ | Suitable for quick testing |
| **2. Standard Mode** | Static Web Server | ✅ | **✅ (Dict Files Required)** | ✅ (Browser Dependent) | ✅ | Recommended method |
| **+ Voice Enhanced** | Add Node.js Proxy | - | - | ✅✅ (More Stable) | - | Provides remote voice caching |

-----

## 1\. Minimalist Mode (Local File Mode)

**Suitable for:** Rapid testing, single-machine personal use.

No server required; open directly using a browser.

1.  Download `jpn_learn.html` from the project.
2.  Double-click the file to open it directly.

> **⚠️ Notes:**
>
>   * **Sentence Parsing**: When the program detects the `file://` protocol, it automatically switches to **CDN Mode** to download the dictionary. Please ensure your computer is connected to the Internet.
>   * **Voice**: If your browser does not support local Japanese voice packages, it will attempt to connect to Google TTS. In some browsers with strict settings, this may result in no sound due to CORS.
>   * **PWA**: Will not function (Service Workers do not support the `file://` protocol).

-----

## 2\. Standard Mode (Static Web Server)

**Suitable for:** Official deployment, hosting on GitHub Pages, NAS, or Cloud storage.

Supports full PWA features (installable to home screen, offline caching).

### Step A: Prepare Server and Files

1.  Place `jpn_learn.html`, `jpn_learn_manifest.json`, `jpn_learn_sw.js`, and the icon images into your Web Server directory.
2.  **(Important)** Prepare the dictionary files (see Step B).

### Step B: Download and Configure Dictionary

In Server mode, to avoid Cross-Origin Resource Sharing (CORS) errors, **you must place the dictionary files on the Server**; CDN cannot be used.

1.  **Download Source**: Go to the official kuromoji.js GitHub to download the dictionary files.
      * Link: [kuromoji.js dict folder](https://github.com/takuyaa/kuromoji.js/tree/master/dict)
2.  **Required Files**: Download all `.dat.gz` files in that directory (approximately 10 files).
3.  **Placement**: Create a `dict/` folder in the same directory as `jpn_learn.html` and place the files inside.

> **⚠️ If Dictionary is Not Configured:**
> The program will fail to load the dictionary (HTTP 404), causing the **"Parse" and "Seq. (Read Aloud)" buttons to become unusable**, though other functions will remain unaffected.

-----

## 3\. Voice Enhanced Plugin (Optional TTS Proxy)

**Suitable for:** Solving remote TTS caching issues and providing more stable remote speech synthesis.

Whether you are using "Minimalist Mode" or "Standard Mode," you can add this Proxy to cache remote audio.

### Installation & Startup

1.  Ensure **Node.js** is installed.
2.  Enter the `tts-proxy` folder:
    ```bash
    cd tts-proxy
    npm install
    ```
3.  Start the Proxy Server:
    ```bash
    node server.js
    ```
    *(Default port is 3000)*

### How It Works

  * When `jpn_learn.html` starts, it automatically checks for `http://localhost:3000/ready`.
  * If detected successfully, all remote voice requests will be automatically forwarded to the Proxy, providing remote voice caching.

-----

## 🛠 Troubleshooting

### Q1: Why is the "Seq." (Read Aloud) button grayed out (Disabled)?

This indicates **Dictionary Load Failure**.

  * **Server Mode**: Press F12 to open the Console. If a 404 appears, it means there are no files in the `dict/` folder (the project defaults to not using CDN in Server mode to avoid issues; please ensure you download the dictionary files).
  * **Local File Mode**: Please check your internet connection; the program needs to connect to the CDN to download the dictionary.

### Q2: Why can't I hear any sound?

Please observe the **Status Indicator** in the top right of the page:

  * **Green Light (Cached)**: Cache read successful. If no sound, check your speakers.
  * **Orange Light (Remote)**: Audio is downloading.
      * If it keeps spinning or remains silent, browser security settings might be blocking direct requests to Google.
      * **Solution**: Start the Node.js Proxy (see Section 3) or use a browser with better support like Chrome/Edge.

### Q3: Why can't I install the App (PWA)?

PWA installation conditions are strict. Please confirm:

1.  The URL must be `https://` (or `http://localhost`).
2.  `jpn_learn_manifest.json` and `jpn_learn_sw.js` are loading correctly (check via DevTools \> Application tab).
