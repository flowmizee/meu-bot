const makeWASocket = require('@whiskeysockets/baileys').default;
const { useSingleFileAuthState } = require('@whiskeysockets/baileys');
const { handleMessage } = require('./flow');
const qrcode = require('qrcode-terminal');

const { state, saveCreds } = useSingleFileAuthState('./auth_info.json');

async function startBot() {
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true, // para ver QR no Termux
  });

  // Captura novas mensagens
  sock.ev.on('messages.upsert', async m => {
    const message = m.messages[0];
    if (message.message && !message.key.fromMe) {
      try {
        await handleMessage(sock, message);
      } catch (err) {
        console.error('Erro ao processar mensagem:', err);
      }
    }
  });

  // Eventos de conexão
  sock.ev.on('connection.update', update => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      console.log('Conexão fechada, tentando reconectar...');
      // reconectar após 5 segundos
      setTimeout(() => startBot(), 5000);
    } else if (connection === 'open') {
      console.log('Bot conectado!');
    }
  });

  // Salva credenciais automaticamente
  sock.ev.on('creds.update', saveCreds);
}

// Inicia o bot
startBot();
