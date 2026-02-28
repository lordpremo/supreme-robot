// src/state.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'state.json');

function ensureFile() {
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(
      filePath,
      JSON.stringify(
        {
          ownerNumber: null,
          protections: {
            antilink: false,
            antibadword: false,
            antidelete: false,
            autotyping: false
          },
          badwords: ['fuck', 'bitch', 'asshole']
        },
        null,
        2
      )
    );
  }
}

function readState() {
  ensureFile();
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeState(data) {
  ensureFile();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getState() {
  return readState();
}

function setOwnerNumber(num) {
  const s = readState();
  s.ownerNumber = num;
  writeState(s);
}

function getOwnerNumber() {
  return readState().ownerNumber;
}

function getProtections() {
  return readState().protections;
}

function setProtection(key, value) {
  const s = readState();
  if (s.protections[key] !== undefined) {
    s.protections[key] = value;
    writeState(s);
  }
}

function getBadwords() {
  return readState().badwords;
}

function addBadword(word) {
  const s = readState();
  if (!s.badwords.includes(word.toLowerCase())) {
    s.badwords.push(word.toLowerCase());
    writeState(s);
  }
}

function removeBadword(word) {
  const s = readState();
  s.badwords = s.badwords.filter(w => w !== word.toLowerCase());
  writeState(s);
}

module.exports = {
  getState,
  setOwnerNumber,
  getOwnerNumber,
  getProtections,
  setProtection,
  getBadwords,
  addBadword,
  removeBadword
};
