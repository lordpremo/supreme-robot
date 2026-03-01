// src/commands/settings.js
const { getState } = require('../state');

async function getsettings(sock, msg, info, reply) {
  const s = getState();
  const text = `
*${info.botName} SETTINGS*

• Owner: ${s.ownerNumber || 'Not set'}
• antilink: ${s.protections.antilink}
• antibadword: ${s.protections.antibadword}
• antidelete: ${s.protections.antidelete}
• autotyping: ${s.protections.autotyping}
`.trim();
  await reply(text);
}

async function resetsetting(sock, msg, info, reply) {
  await reply('Resetting settings is not implemented fully yet (owner & protections stay).');
}

module.exports = {
  getsettings,
  resetsetting
};
