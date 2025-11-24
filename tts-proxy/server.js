const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 3000;

// 允許所有來源跨域請求 (解決前端 CORS 問題的核心)
app.use(cors());

app.get('/tts', async (req, res) => {
    const text = req.query.q;
    if (!text) {
        return res.status(400).send('Missing text parameter (q)');
    }

    // Google TTS URL
    // client=tw-ob 是 Google Translate 的公開 API 參數之一
    const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ja&client=tw-ob&q=${encodeURIComponent(text)}`;

    try {
        // 偽裝成瀏覽器發送請求 (避免被 Google 擋掉非瀏覽器的 User-Agent)
        const response = await axios({
            method: 'get',
            url: googleUrl,
            responseType: 'stream', // 重要：告訴 axios 我們要接二進位流
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://translate.google.com/'
            }
        });

        // 設定回傳標頭，告訴前端這是音訊
        res.set('Content-Type', 'audio/mpeg');
        
        // 將 Google 回傳的資料流 (Stream) 直接轉發 (Pipe) 給前端
        response.data.pipe(res);

    } catch (error) {
        console.error('TTS Proxy Error:', error.message);
        res.status(500).send('Error fetching TTS');
    }
});

app.get('/ready', (req, res) => {
	res.end();
});

app.listen(PORT, () => {
    console.log(`TTS Proxy running at http://localhost:${PORT}`);
});