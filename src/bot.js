// src/bot.js
const makeWASocket = require('@whiskeysockets/baileys').default;
const {
  useMultiFileAuthState,
  DisconnectReason
} = require('@whiskeysockets/baileys');
const P = require('pino');
const path = require('path');

const { handleMessage, handleMessageUpdate } = require('./handler');
const { setOwnerNumber } = require('./state');

let mainSock;

async function initBot() {
  const { state, saveCreds } = await useMultiFileAuthState(
    path.join(__dirname, '..', 'auth')
  );

  mainSock = makeWASocket({
    auth: state,
    logger: P({ level: 'silent' }),
    browser: ['BROKEN LORD CMD', 'Chrome', '1.0.0']
  });

  mainSock.ev.on('creds.update', saveCreds);

  mainSock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode;
      if (reason === DisconnectReason.loggedOut) {
        console.log('Logged out. Session cleared.');
      } else {
        console.log('Reconnecting...');
        initBot();
      }
    }

    if (connection === 'open') {
      console.log('BOT CONNECTED SUCCESSFULLY');
    }
  });

  mainSock.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0];
    if (!msg || !msg.message) return;
    try {
      await handleMessage(mainSock, msg);
    } catch (e) {
      console.error('MSG ERROR:', e);
    }
  });

  mainSock.ev.on('messages.update', async (updates) => {
    try {
      await handleMessageUpdate(mainSock, updates);
    } catch (e) {
      console.error('UPDATE ERROR:', e);
    }
  });

  return mainSock;
}

// Pair code generator + owner binding
async function requestPairCode(phone) {
  const clean = phone.replace(/[^0-9]/g, '');

  const { state, saveCreds } = await useMultiFileAuthState(
    path.join(__dirname, '..', 'pairing')
  );

  const tempSock = makeWASocket({
    auth: state,
    logger: P({ level: 'silent' }),
    browser: ['BROKEN LORD CMD PAIR', 'Chrome', '1.0.0']
  });

  tempSock.ev.on('creds.update', saveCreds);

  if (!tempSock.requestPairingCode) {
    throw new Error('Baileys version does not support pairing code');
  }

  const code = await tempSock.requestPairingCode(clean);
  console.log('PAIR CODE FOR', clean, ':', code);

  // Bind owner to this number
  setOwnerNumber(clean);

  return code;
}

module.exports = {
  initBot,
  requestPairCode
};
