// src/bot.js
const makeWASocket = require('@whiskeysockets/baileys').default;
const {
  useMultiFileAuthState,
  DisconnectReason
} = require('@whiskeysockets/baileys');
const P = require('pino');
const path = require('path');

let mainSock;
let authState;
let saveCreds;

async function initBot() {
  const auth = await useMultiFileAuthState(path.join(__dirname, '..', 'auth'));
  authState = auth.state;
  saveCreds = auth.saveCreds;

  mainSock = makeWASocket({
    auth: authState,
    printQRInTerminal: true,
    logger: P({ level: 'silent' }),
    browser: ['BROKEN LORD CMD', 'Chrome', '1.0.0']
  });

  mainSock.ev.on('creds.update', saveCreds);

  mainSock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) initBot();
    }

    if (connection === 'open') {
      console.log('BOT CONNECTED SUCCESSFULLY');
    }
  });

  return mainSock;
}

// FIXED PAIR CODE GENERATOR
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
    throw new Error('Pairing not supported on this version');
  }

  const code = await tempSock.requestPairingCode(clean);
  console.log('PAIR CODE:', code);
  return code;
}

module.exports = {
  initBot,
  requestPairCode
};
