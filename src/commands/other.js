// src/commands/other.js
function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
}

async function botstatus(sock, msg, info, reply) {
  const uptime = formatUptime(process.uptime());
  await reply(`*${info.botName} STATUS*\n\n• Mode: Private\n• Uptime: ${uptime}`);
}

async function ping(sock, msg, info, reply) {
  const start = Date.now();
  await reply('Pinging...');
  const end = Date.now();
  const ms = end - start;
  await reply(`Pong! ${ms} ms`);
}

async function time(sock, msg, info, reply) {
  const now = new Date();
  await reply(`Current server time: ${now.toLocaleString()}`);
}

async function runtime(sock, msg, info, reply) {
  const uptime = formatUptime(process.uptime());
  await reply(`Runtime: ${uptime}`);
}

module.exports = {
  botstatus,
  ping,
  time,
  runtime
};
