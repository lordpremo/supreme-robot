// index.js
const express = require('express');
const path = require('path');
const { initBot, requestPairCode } = require('./src/bot');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'web', 'public')));

app.post('/api/pair', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone number is required' });

    const code = await requestPairCode(phone);
    return res.json({ code });
  } catch (e) {
    console.error('PAIR ERROR:', e);
    return res.status(500).json({ error: 'Failed to generate pair code' });
  }
});

app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});

initBot()
  .then(() => console.log('🤖 BROKEN LORD CMD bot initialized'))
  .catch(err => console.error('Bot init error:', err));
