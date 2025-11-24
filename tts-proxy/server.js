const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Allow all corss-origin requests (eliminate CORS issue)
app.use(cors());

app.get('/tts', async (req, res) => {
    const text = req.query.q;
    if (!text) {
        return res.status(400).send('Missing text parameter (q)');
    }

    // Google TTS URL
    // client=tw-ob is one of the Google Translate public API parameters
    const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ja&client=tw-ob&q=${encodeURIComponent(text)}`;

    try {
        // pretend a browser (avoid being blocked by Google due to improper User-Agent)
        const response = await axios({
            method: 'get',
            url: googleUrl,
            responseType: 'stream', // important: instruct axios to use binary stream
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://translate.google.com/'
            }
        });

        // set response header: tell the frontend that this is audio
        res.set('Content-Type', 'audio/mpeg');
        
        // pipe the stream from Google to the frontend
        response.data.pipe(res);

    } catch (error) {
        console.error('TTS Proxy Error:', error.message);
        res.status(500).send('Error fetching TTS');
    }
});

// the endpoint for checking the availability of the proxy
app.get('/ready', (req, res) => {
	res.end();
});

app.listen(PORT, () => {
    console.log(`TTS Proxy running at http://localhost:${PORT}`);
});
