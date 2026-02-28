// src/handler.js
const {
  getOwnerNumber,
  getProtections,
  getBadwords
} = require('./state');

const menu = require('./commands/menu');
const ownerCmd = require('./commands/owner');
const group = require('./commands/group');
const protect = require('./commands/protect');
const fun = require('./commands/fun');
const tools = require('./commands/tools');
const other = require('./commands/other');
const settings = require('./commands/settings');

const PREFIX = '.';
const BOT_NAME = 'BROKEN LORD CMD';

const commands = {
  // core
  menu: menu.menu,

  // owner
  owner: ownerCmd.owner,
  restart: ownerCmd.restart,
  bc: ownerCmd.broadcast,
  mode: ownerCmd.mode,

  // group / protections
  tagall: group.tagall,
  welcome: group.welcomeToggle,
  antilink: protect.antilinkToggle,
  antibadword: protect.antibadwordToggle,
  antidelete: protect.antideleteToggle,
  autotyping: protect.autotypingToggle,
  addbadword: protect.addBadwordCmd,
  delbadword: protect.delBadwordCmd,
  listbadword: protect.listBadwordCmd,

  // fun
  fact: fun.fact,
  jokes: fun.jokes,
  quotes: fun.quotes,
  trivia: fun.trivia,

  // tools
  calculate: tools.calculate,
  fliptext: tools.fliptext,
  say: tools.say,

  // other
  botstatus: other.botstatus,
  ping: other.ping,
  time: other.time,
  runtime: other.runtime,

  // settings
  getsettings: settings.getsettings,
  resetsetting: settings.resetsetting
};

function getText(msg) {
  return (
    msg.message.conversation ||
    msg.message.extendedTextMessage?.text ||
    msg.message.imageMessage?.caption ||
    msg.message.videoMessage?.caption ||
    ''
  );
}

async function handleMessage(sock, msg) {
  const from = msg.key.remoteJid;
  const isGroup = from.endsWith('@g.us');
  const sender = msg.key.participant || msg.key.remoteJid;
  const text = getText(msg);

  const bareSender = sender.split('@')[0];
  const ownerNumber = getOwnerNumber();
  const isOwner = ownerNumber && bareSender === ownerNumber;

  const protections = getProtections();
  const badwords = getBadwords();

  // protections: antibadword + antilink
  if (!msg.key.fromMe && text) {
    if (protections.antibadword && badwords.length) {
      const lower = text.toLowerCase();
      if (badwords.some(w => lower.includes(w))) {
        try {
          await sock.sendMessage(from, { delete: msg.key });
          await sock.sendMessage(from, {
            text: '⚠️ Bad word detected. Message deleted.'
          });
        } catch {}
      }
    }

    if (protections.antilink && /https?:\/\/|wa\.me\/|chat\.whatsapp\.com\//i.test(text)) {
      try {
        await sock.sendMessage(from, { delete: msg.key });
        await sock.sendMessage(from, {
          text: '⚠️ Links are not allowed in this chat.'
        });
      } catch {}
    }
  }

  if (!text.startsWith(PREFIX)) return;

  const body = text.slice(PREFIX.length).trim();
  const [cmdName, ...args] = body.split(/\s+/);
  const cmd = cmdName.toLowerCase();

  const commandFn = commands[cmd];
  if (!commandFn) return;

  const reply = async (txt) => {
    await sock.sendMessage(from, { text: txt }, { quoted: msg });
  };

  // autotyping
  if (protections.autotyping) {
    await sock.sendPresenceUpdate('composing', from);
  }

  const info = {
    from,
    sender,
    isGroup,
    args,
    text: body,
    prefix: PREFIX,
    botName: BOT_NAME,
    isOwner,
    ownerNumber
  };

  // owner-only commands
  const ownerOnly = ['owner', 'restart', 'bc', 'mode', 'addbadword', 'delbadword', 'listbadword'];
  if (ownerOnly.includes(cmd) && !isOwner) {
    return reply('Only the bot owner can use this command.');
  }

  await commandFn(sock, msg, info, reply);
}

// antidelete
async function handleMessageUpdate(sock, updates) {
  const protections = getProtections();
  if (!protections.antidelete) return;

  for (const upd of updates) {
    const { key, update } = upd;
    const protocol = update?.message?.protocolMessage;
    if (protocol && protocol.type === 'REVOKE') {
      const chat = key.remoteJid;
      const deletedKey = protocol.key;
      // simple notice
      await sock.sendMessage(chat, {
        text: '⚠️ Message delete detected (antidelete is ON).'
      });
    }
  }
}

module.exports = {
  handleMessage,
  handleMessageUpdate
};
