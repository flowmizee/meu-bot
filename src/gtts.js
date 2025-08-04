const gTTS = require('gtts');
const fs = require('fs');

async function textToSpeech(texto) {
  const path = `./audios/resposta.mp3`;
  return new Promise((resolve, reject) => {
    const speech = new gTTS(texto, 'pt-br');
    speech.save(path, (err) => {
      if (err) reject(err);
      else resolve(path);
    });
  });
}

module.exports = { textToSpeech };