// src/bot.js
const makeWASocket = require('@whiskeysockets/baileys').default;
const {
  useMultiFileAuthState,
  DisconnectReason
} = require('@whiskeysockets/baileys');
const P = require('pino');
const path = require('path');

let mainSock;

// START MAIN BOT
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
        console.log('Logged out → deleting session');
      } else {
        console.log('Reconnecting...');
        initBot();
      }
    }

    if (update.qr) {
      console.log('QR RECEIVED (ignored on Render)');
    }

    if (connection === 'open') {
      console.log('BOT CONNECTED SUCCESSFULLY');
    }
  });

  return mainSock;
}

// PAIR CODE GENERATOR
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
  console.log('PAIR CODE:', code);
  return code;
}

module.exports = {
  initBot,
  requestPairCode
};
