const { getSheetData, updateSheetData } = require('./sheets');
const tesseract = require('tesseract.js');
const axios = require('axios');

async function handleMessage(sock, message) {
  const from = message.key.remoteJid;

  // Checa se é texto ou mídia
  if (message.message?.conversation || message.message?.imageMessage || message.message?.documentMessage) {
    // Envia menu com botões
    await sock.sendMessage(from, {
      text: 'Olá! Aqui está nosso menu 📝',
      footer: 'Escolha uma opção abaixo:',
      buttons: [
        { buttonId: 'pedido', buttonText: { displayText: 'Fazer Pedido' }, type: 1 },
        { buttonId: 'promocao', buttonText: { displayText: 'Ver Promoções' }, type: 1 },
        { buttonId: 'atendimento', buttonText: { displayText: 'Falar com Atendimento' }, type: 1 }
      ],
      headerType: 1
    });
  }
}

// Função para OCR de comprovante
async function validateReceipt(buffer) {
  const { data: { text } } = await tesseract.recognize(buffer, 'por');
  return text; // você pode criar lógica de validação
}

module.exports = { handleMessage, validateReceipt };
