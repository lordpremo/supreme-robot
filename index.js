// index.js
const express = require('express');
const path = require('path');
const { initBot, requestPairCode } = require('./src/bot');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'web', 'public')));

// NEW: GET /code?number=2557xxxx
app.get('/code', async (req, res) => {
  try {
    const phone = (req.query.number || '').toString().trim();
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // sanitize
    const clean = phone.replace(/[^0-9]/g, '');
    if (!/^\d{10,15}$/.test(clean)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    const code = await requestPairCode(clean);
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
  .catch(err => console.error('Bot init error:', err));q
