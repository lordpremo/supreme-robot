// src/commands/tools.js
async function calculate(sock, msg, info, reply) {
  const expr = info.args.join(' ');
  if (!expr) return reply('Usage: .calculate 1+2*3');

  try {
    if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
      return reply('Only basic numbers and + - * / ( ) are allowed.');
    }
    // eslint-disable-next-line no-eval
    const result = eval(expr);
    await reply(`${expr} = ${result}`);
  } catch {
    await reply('Invalid expression.');
  }
}

async function fliptext(sock, msg, info, reply) {
  const text = info.args.join(' ');
  if (!text) return reply('Usage: .fliptext your text');
  await reply(text.split('').reverse().join(''));
}

async function say(sock, msg, info, reply) {
  const text = info.args.join(' ');
  if (!text) return reply('Usage: .say your message');
  await reply(text);
}

module.exports = {
  calculate,
  fliptext,
  say
};
