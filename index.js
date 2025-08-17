const makeWASocket = require('@whiskeysockets/baileys').default;
const { useSingleFileAuthState } = require('@whiskeysockets/baileys'); // só assim funciona
const { handleMessage } = require('./flow');

const { state, saveState } = useSingleFileAuthState('./auth_info.json');

async function startBot() {
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true // só para testes locais
  });

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

  sock.ev.on('connection.update', update => {
    const { connection } = update;
    if (connection === 'close') {
      console.log('Conexão fechada, tentando reconectar...');
      setTimeout(() => startBot(), 5000);
    } else if (connection === 'open') {
      console.log('Bot conectado!');
    }
  });

  sock.ev.on('creds.update', saveState);
}

startBot();
