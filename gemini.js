const axios = require('axios');

async function geminiResponse(prompt) {
  try {
    const res = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDZGPUHvcFwxQyF6xxCFXv6C_N4ZqodXKs',
      { contents: [{ parts: [{ text: prompt }] }] }
    );
    return res.data.candidates[0]?.content?.parts[0]?.text || 'Não entendi.';
  } catch (err) {
    console.error(err);
    return 'Erro ao gerar resposta.';
  }
}

module.exports = { geminiResponse };