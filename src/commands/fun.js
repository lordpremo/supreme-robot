// src/commands/fun.js
const facts = [
  'The first computer bug was an actual moth stuck in a relay.',
  'Octopuses have three hearts.',
  'Bananas are berries, but strawberries are not.'
];

const jokes = [
  'Why do programmers prefer dark mode? Because light attracts bugs.',
  'I would tell you a UDP joke, but you might not get it.',
  'There are 10 types of people: those who understand binary and those who don’t.'
];

const quotes = [
  '“Code is like humor. When you have to explain it, it’s bad.” – Cory House',
  '“Programs must be written for people to read.” – Harold Abelson',
  '“First, solve the problem. Then, write the code.” – John Johnson'
];

const trivia = [
  'TRIVIA: The first WhatsApp version was released in 2009.',
  'TRIVIA: JavaScript was created in just 10 days by Brendan Eich.',
  'TRIVIA: The name “Bluetooth” comes from a 10th-century Scandinavian king.'
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function fact(sock, msg, info, reply) {
  await reply(randomItem(facts));
}

async function jokesCmd(sock, msg, info, reply) {
  await reply(randomItem(jokes));
}

async function quotesCmd(sock, msg, info, reply) {
  await reply(randomItem(quotes));
}

async function triviaCmd(sock, msg, info, reply) {
  await reply(randomItem(trivia));
}

module.exports = {
  fact,
  jokes: jokesCmd,
  quotes: quotesCmd,
  trivia: triviaCmd
};
