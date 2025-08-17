const { getSheetData, updateSheetData } = require('./sheets');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const tesseract = require('tesseract.js');

// Função principal
async function handleMessage(sock, message) {
  const from = message.key.remoteJid;

  // Texto ou mídia
  if (message.message?.conversation || message.message?.imageMessage || message.message?.documentMessage) {
    if (message.message?.conversation) {
      await sendMenu(sock, from);
    } else {
      try {
        const buffer = await downloadMediaMessage(message, 'buffer', {});
        const text = await validateReceipt(buffer);
        if (text.includes('PIX') || text.includes('Comprovante')) {
          await updateSheetData('Pedidos', { whatsapp: from, status: 'Pago', comprovante: text });
          await sock.sendMessage(from, { text: 'Pagamento confirmado! ✅ Seu pedido foi registrado.' });
        } else {
          await sock.sendMessage(from, { text: 'Não conseguimos validar seu comprovante. 😕 Por favor, envie novamente.' });
        }
      } catch (err) {
        console.error('Erro ao processar comprovante:', err);
        await sock.sendMessage(from, { text: 'Ocorreu um erro ao validar o comprovante. Tente novamente.' });
      }
    }
  }
}

// Menu com botões
async function sendMenu(sock, from) {
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

// Validação OCR
async function validateReceipt(buffer) {
  const { data: { text } } = await tesseract.recognize(buffer, 'por');
  return text;
}

module.exports = { handleMessage, validateReceipt };
