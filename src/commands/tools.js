// src/commands/tools.js
async function calculate(sock, msg, info, reply) {
  const expr = info.args.join(' ');
  if (!expr) return reply('Usage: .calculate 1+2*3');

  try {
    // VERY basic safe eval: only numbers and operators
    if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
      return reply('Only basic numbers and + - * / ( ) are allowed.');
    }
    // eslint-disable-next-line no-eval
    const result = eval(expr);
    await reply(`${expr} = ${result}`);
  } catch (err) {
    await reply('Invalid expression.');
  }
}

async function fliptext(sock, msg, info, reply) {
  const text = info.args.join(' ');
  if (!text) return reply('Usage: .fliptext your text');
  const flipped = text.split('').reverse().join('');
  await reply(flipped);
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
