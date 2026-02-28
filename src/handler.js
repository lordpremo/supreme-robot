// src/handler.js
const menu = require('./commands/menu');
const fun = require('./commands/fun');
const group = require('./commands/group');
const other = require('./commands/other');
const settings = require('./commands/settings');
const tools = require('./commands/tools');

const commands = {
  // MENU
  menu: menu.menu,

  // FUN
  fact: fun.fact,
  jokes: fun.jokes,
  quotes: fun.quotes,
  trivia: fun.trivia,

  // GROUP (basic, no APIs)
  tagall: group.tagall,
  welcome: group.welcomeToggle,

  // OTHER
  botstatus: other.botstatus,
  ping: other.ping,
  time: other.time,
  runtime: other.runtime,

  // SETTINGS (simple toggles in memory)
  getsettings: settings.getsettings,
  resetsetting: settings.resetsetting,

  // TOOLS (no external APIs)
  calculate: tools.calculate,
  fliptext: tools.fliptext,
  say: tools.say
};

async function handleMessage(sock, msg, ctx) {
  const from = msg.key.remoteJid;
  const isGroup = from.endsWith('@g.us');
  const sender =
    msg.key.participant || msg.key.remoteJid;

  const text =
    msg.message.conversation ||
    msg.message.extendedTextMessage?.text ||
    '';

  if (!text.startsWith(ctx.prefix)) return;

  const body = text.slice(ctx.prefix.length).trim();
  const [cmdName, ...args] = body.split(/\s+/);
  const cmd = cmdName.toLowerCase();

  const commandFn = commands[cmd];
  if (!commandFn) return;

  const reply = async (txt) => {
    await sock.sendMessage(from, { text: txt }, { quoted: msg });
  };

  const info = {
    from,
    sender,
    isGroup,
    args,
    text: body,
    prefix: ctx.prefix,
    botName: ctx.botName
  };

  await commandFn(sock, msg, info, reply);
}

module.exports = { handleMessage };
