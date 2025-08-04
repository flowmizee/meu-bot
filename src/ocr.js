const Tesseract = require('tesseract.js');

async function extractTextFromImage(imagePath) {
  const result = await Tesseract.recognize(imagePath, 'por');
  return result.data.text;
}

module.exports = { extractTextFromImage };