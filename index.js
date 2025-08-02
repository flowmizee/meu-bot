const venom = require('venom-bot');
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = 'AIzaSyDPobXmO5VPjV_bqOsAltCaOSr4B7x4nk8';

venom.create({
  session: 'session-name',
  multidevice: true
}).then(client => {

  app.post('/webhook', async (req, res) => {
    const { from, body } = req.body;

    const now = new Date();
    const hour = now.getHours();

    const isWorkingHour =
      (hour >= 8 && hour < 12) ||
      (hour >= 14 && hour < 18) ||
      (hour >= 20 && hour < 22);

    if (isWorkingHour) {
      try {
        const resposta = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
          contents: [{ parts: [{ text: body }] }]
        });

        const textoGemini = resposta.data.candidates?.[0]?.content?.parts?.[0]?.text || "Desculpe, não entendi.";

        await client.sendText(from, textoGemini);
      } catch (error) {
        console.error('Erro na Gemini:', error.message);
      }
    }

    res.sendStatus(200); // Sempre responde 200 ao webhook
  });

  client.onMessage(async message => {
    if (!message.isGroupMsg) {
      await axios.post(`http://localhost:${PORT}/webhook`, {
        from: message.from,
        body: message.body
      });
    }
  });

  app.listen(PORT, () => {
    console.log(`Bot ativo na porta ${PORT}`);
  });
});