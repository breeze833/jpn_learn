# 🇯🇵 Japanese Learning Assistant

[繁體中文](README.zh-TW.md) | **English**

**Note**: *This application currently features a Traditional Chinese user interface. However, the underlying logic and code structures are universal and can be adapted for other languages.*

A web tool designed specifically for Japanese beginners. **No installation, no registration, and no server setup required.** It consists of a single file—just open it in your browser to start practicing immediately.

Whether you are a novice memorizing the 50-tone Kana or an advanced learner practicing sentence shadowing, this tool is here to help.

## 🚀 Quick Start (In 30 Seconds)

You can download the single HTML file and use it directly without any installation:

1.  **Get the File**: [📥 Click here to go to the jpn\_learn.html download page](jpn_learn_app/jpn_learn.html)
      * *Once on the page, click the <kbd>⬇</kbd> (Download raw file) icon in the top right corner.*
2.  **Open Directly**: Double-click the downloaded file or drag it into your browser window.
3.  **Start Learning**: Once loaded, you are ready to go\!

> **Note**: Please ensure your device is **connected to the internet**, as the app needs to load external dictionary files and the speech engine.

-----

## 🎯 Key Features

### 1\. Interactive Kana Practice Cards

Stop rote memorization\! We help you memorize Hiragana and Katakana quickly through visual and auditory aids.

  * **Hiragana/Katakana Switch**: Quickly toggle between modes to compare and learn.
  * **Stroke Order Animations**: Click any card to view the correct writing stroke order.
  * **Mnemonics**: Each character comes with a fun "Memory Aid" note to help you instantly link the shape to the sound.
  * **Native/Synth Audio**: Click cards to hear standard pronunciation.

### 2\. Smart Sentence Parser (Reading Aid)

Stuck on how to read a long Japanese sentence? Just paste it here\!

  * **Auto-Segmentation & Furigana**: Breaks sentences into words and automatically adds Hiragana readings (Furigana) above them.
  * **Word-by-Word Shadowing**: Features a "Karaoke-style" mode where the cursor highlights each word as it is spoken—perfect for practicing shadowing.
  * **Individual Pronunciation**: Hover over any specific word to hear its pronunciation individually.

### 3\. Personalized Audio Settings

  * **Speed Control**: Freely adjust the playback speed (0.5x \~ 2.0x).
  * **Dual Engine Support**: Supports "Local Voice (Offline)" and "Remote Voice (High-quality Google TTS)". The system automatically detects the best option.

-----

## 📖 User Guide

### How to practice Kana?

1.  Click the **"50音練習" (Kana Practice)** tab at the top.
2.  Select **"平假名" (Hiragana)** or **"片假名" (Katakana)** mode.
3.  Click on any character card to view details, stroke order, and mnemonics.

### How to parse sentences?

1.  Click the **"句子解析" (Sentence Parsing)** tab at the top.
2.  Paste or type any Japanese sentence into the input box (e.g., `今日の天気はとてもいいですね`).
3.  Click the blue **"🔍 解析" (Parse)** button.
4.  Once parsed, choose **"🔊 整句" (Full Sentence)** to listen, or **"▶️ 逐詞" (Word-by-Word)** to shadow along.

-----

## 🤖 About This Project

This is an experimental project demonstrating a new mode of human-AI collaboration. ([Read the dev story](https://medium.com/@breeze833/pair-programming-with-ai-how-i-built-a-speaking-japanese-learning-assistant-in-20-hours-ef07a674966c))

**Every single line of code** in this program was generated through "pure conversation" with **Google Gemini 3**. The development process did not rely on specialized AI coding environments (like Cursor or GitHub Copilot). Instead, it unfolded like a chat: the human proposed ideas, requirements, and high-level solutions; the AI acted as the architect and engineer. We debug, optimize, and implement features step-by-step.

This proves that practical and complete applications can be created through natural language communication, even without complex development environments.
