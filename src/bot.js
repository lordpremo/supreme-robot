// src/bot.js
const makeWASocket = require('@whiskeysockets/baileys').default;
const {
  useMultiFileAuthState,
  DisconnectReason
} = require('@whiskeysockets/baileys');
const P = require('pino');
const path = require('path');

const { handleMessage } = require('./handler');

let sock;
let authStateGlobal;
let saveCredsGlobal;

const BOT_NAME = 'BROKEN LORD CMD';
const PREFIX = '.';

async function initBot() {
  const { state, saveCreds } = await useMultiFileAuthState(
    path.join(__dirname, '..', 'auth')
  );
  authStateGlobal = state;
  saveCredsGlobal = saveCreds;

  sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    logger: P({ level: 'silent' }),
    browser: ['BROKEN LORD CMD', 'Chrome', '1.0.0']
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Connection closed. Reconnect:', shouldReconnect);
      if (shouldReconnect) {
        initBot();
      }
    } else if (connection === 'open') {
      console.log('✅ BROKEN LORD CMD connected');
    }
  });

  sock.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0];
    if (!msg.message || msg.key.fromMe) return;
    try {
      await handleMessage(sock, msg, { prefix: PREFIX, botName: BOT_NAME });
    } catch (err) {
      console.error('Handle message error:', err);
    }
  });

  return sock;
}

// Request pairing code for a phone number
async function requestPairCode(phone) {
  if (!authStateGlobal) {
    throw new Error('Bot not initialized yet');
  }

  // Create a temporary socket only for pairing
  const tempSock = makeWASocket({
    auth: authStateGlobal,
    logger: P({ level: 'silent' }),
    browser: ['BROKEN LORD CMD Pair', 'Chrome', '1.0.0']
  });

  if (!tempSock.requestPairingCode) {
    throw new Error('Pairing not supported in this Baileys version');
  }

  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const code = await tempSock.requestPairingCode(cleanPhone);
  console.log('Generated pair code for', cleanPhone, ':', code);
  return code;
}

module.exports = {
  initBot,
  requestPairCode
};
