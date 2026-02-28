// src/commands/owner.js
const { getOwnerNumber } = require('../state');

async function owner(sock, msg, info, reply) {
  const owner = getOwnerNumber();
  if (!owner) return reply('Owner is not set yet. Pair the bot first.');
  await reply(`*BROKEN LORD CMD OWNER*\n\n• Number: ${owner}`);
}

async function restart(sock, msg, info, reply) {
  await reply('Restarting process...');
  process.exit(0);
}

async function broadcast(sock, msg, info, reply) {
  const text = info.args.join(' ');
  if (!text) return reply('Usage: .bc your message');

  const chats = await sock.groupFetchAllParticipating().catch(() => ({}));
  const ids = Object.keys(chats);

  for (const id of ids) {
    await sock.sendMessage(id, { text: `*BROADCAST*\n\n${text}` });
  }

  await reply(`Broadcast sent to ${ids.length} groups.`);
}

let modeState = 'private';

async function mode(sock, msg, info, reply) {
  const arg = info.args[0];
  if (!arg) return reply(`Current mode: *${modeState}*\nUsage: .mode private/public`);

  const m = arg.toLowerCase();
  if (!['private', 'public'].includes(m)) {
    return reply('Mode must be private or public.');
  }
  modeState = m;
  await reply(`Mode set to *${modeState}*`);
}

module.exports = {
  owner,
  restart,
  broadcast,
  mode
};
