// src/commands/settings.js
const settings = {
  alwaysonline: false,
  chatbot: false
};

async function getsettings(sock, msg, info, reply) {
  const text = `
*${info.botName} SETTINGS (Local)*

• alwaysonline: ${settings.alwaysonline}
• chatbot: ${settings.chatbot}
`.trim();
  await reply(text);
}

async function resetsetting(sock, msg, info, reply) {
  settings.alwaysonline = false;
  settings.chatbot = false;
  await reply('All settings reset (local memory).');
}

module.exports = {
  getsettings,
  resetsetting,
  settings
};
