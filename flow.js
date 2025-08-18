const { sendMessage } = require('@whiskeysockets/baileys');
const { getSheetData, addSheetData } = require('./sheets');

async function handleMessage(sock, message) {
  const text = message.message.conversation || '';
  const from = message.key.remoteJid;

  // Exemplo simples de resposta
  if (text.toLowerCase() === 'oi') {
    await sendMessage(sock, from, { text: 'Olá! Como posso ajudar?' });
  }

  // Salvar pedido ou mensagem na planilha
  await addSheetData([from, text, new Date().toLocaleString()]);
}

module.exports = { handleMessage };
