// src/commands/group.js
// Simple in-memory welcome toggle per group
const welcomeSettings = {};

async function tagall(sock, msg, info, reply) {
  if (!info.isGroup) {
    return reply('This command works only in groups.');
  }

  const metadata = await sock.groupMetadata(info.from);
  const participants = metadata.participants || [];
  const mentions = participants.map(p => p.id);
  const text = participants.map(p => `@${p.id.split('@')[0]}`).join(' ');

  await sock.sendMessage(
    info.from,
    { text: text || 'No members found.', mentions },
    { quoted: msg }
  );
}

async function welcomeToggle(sock, msg, info, reply) {
  if (!info.isGroup) {
    return reply('This command works only in groups.');
  }

  const current = welcomeSettings[info.from] || false;
  const next = !current;
  welcomeSettings[info.from] = next;

  await reply(
    `Welcome message is now *${next ? 'ON' : 'OFF'}* for this group. (Local memory only)`
  );
}

module.exports = {
  tagall,
  welcomeToggle,
  welcomeSettings
};
