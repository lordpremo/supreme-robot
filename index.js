// index.js
const express = require('express');
const path = require('path');
const { initBot, requestPairCode } = require('./src/bot');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON body
app.use(express.json());

// Serve static website
app.use(express.static(path.join(__dirname, 'web', 'public')));

// Pair code API
app.post('/api/pair', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    const code = await requestPairCode(phone);
    return res.json({ code });
  } catch (err) {
    console.error('Error generating pair code:', err);
    return res.status(500).json({ error: 'Failed to generate pair code' });
  }
});

app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});

// Start bot
initBot().then(() => {
  console.log('🤖 BROKEN LORD CMD bot initialized');
}).catch(err => {
  console.error('Bot init error:', err);
});
