// src/commands/protect.js
const {
  getProtections,
  setProtection,
  getBadwords,
  addBadword,
  removeBadword
} = require('../state');

async function toggle(key, info, reply) {
  const current = getProtections()[key];
  const next = !current;
  setProtection(key, next);
  await reply(`${key} is now *${next ? 'ON' : 'OFF'}*`);
}

async function antilinkToggle(sock, msg, info, reply) {
  await toggle('antilink', info, reply);
}

async function antibadwordToggle(sock, msg, info, reply) {
  await toggle('antibadword', info, reply);
}

async function antideleteToggle(sock, msg, info, reply) {
  await toggle('antidelete', info, reply);
}

async function autotypingToggle(sock, msg, info, reply) {
  await toggle('autotyping', info, reply);
}

async function addBadwordCmd(sock, msg, info, reply) {
  const word = info.args[0];
  if (!word) return reply('Usage: .addbadword word');
  addBadword(word);
  await reply(`Added badword: *${word.toLowerCase()}*`);
}

async function delBadwordCmd(sock, msg, info, reply) {
  const word = info.args[0];
  if (!word) return reply('Usage: .delbadword word');
  removeBadword(word);
  await reply(`Removed badword: *${word.toLowerCase()}*`);
}

async function listBadwordCmd(sock, msg, info, reply) {
  const list = getBadwords();
  if (!list.length) return reply('No badwords set.');
  await reply(`*Badwords list:*\n- ${list.join('\n- ')}`);
}

module.exports = {
  antilinkToggle,
  antibadwordToggle,
  antideleteToggle,
  autotypingToggle,
  addBadwordCmd,
  delBadwordCmd,
  listBadwordCmd
};
