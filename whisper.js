const { exec } = require('child_process');

function transcribeAudio(audioPath) {
  return new Promise((resolve, reject) => {
    exec(`whisper ${audioPath} --language Portuguese --model base --output_format txt`, (err) => {
      if (err) return reject(err);

      const texto = require('fs').readFileSync(audioPath.replace('.ogg', '.txt'), 'utf-8');
      resolve(texto);
    });
  });
}

module.exports = { transcribeAudio };