// src/commands/menu.js
const os = require('os');

function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
}

async function menu(sock, msg, info, reply) {
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  const total = os.totalmem() / 1024 / 1024;
  const ramPercent = Math.round((used / total) * 100);
  const barLength = 10;
  const filled = Math.round((ramPercent / 100) * barLength);
  const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);

  const uptime = formatUptime(process.uptime());

  const menuText = `
┏▣ ◈ *${info.botName}* ◈
┃ *ᴏᴡɴᴇʀ* : Not Set!
┃ *ᴘʀᴇғɪx* : [ ${info.prefix} ]
┃ *ʜᴏsᴛ* : Render
┃ *ᴘʟᴜɢɪɴs* : Offline Core
┃ *ᴍᴏᴅᴇ* : Private
┃ *ᴠᴇʀsɪᴏɴ* : 1.0.0
┃ *sᴘᴇᴇᴅ* : ~ ms
┃ *ᴜᴘᴛɪᴍᴇ* : ${uptime}
┃ *ᴜsᴀɢᴇ* : ${used.toFixed(1)} MB of ${total.toFixed(0)} MB
┃ *ʀᴀᴍ:* [${bar}] ${ramPercent}%
┗▣ 

┏▣ ◈ *AI MENU* ◈
│➽ analyze
│➽ code
│➽ generate
│➽ programming
│➽ summarize
│➽ teach
┗▣ 

┏▣ ◈ *FUN MENU* ◈
│➽ fact
│➽ jokes
│➽ quotes
│➽ trivia
┗▣ 

┏▣ ◈ *GROUP MENU* ◈
│➽ tagall
│➽ welcome
┗▣ 

┏▣ ◈ *OTHER MENU* ◈
│➽ botstatus
│➽ ping
│➽ runtime
│➽ time
┗▣ 

┏▣ ◈ *SETTINGS MENU* ◈
│➽ getsettings
│➽ resetsetting
┗▣ 

┏▣ ◈ *TOOLS MENU* ◈
│➽ calculate
│➽ fliptext
│➽ say
┗▣ 
`.trim();

  await reply(menuText);
}

module.exports = { menu };
