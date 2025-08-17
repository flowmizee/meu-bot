const makeWASocket = require('@whiskeysockets/baileys').default;
const { useSingleFileAuthState } = require('@whiskeysockets/baileys/lib/Defaults'); // Ajuste aqui
const { handleMessage } = require('./flow');

const { state, saveState } = useSingleFileAuthState('./auth_info.json'); // 'saveState' é o correto

async function startBot() {
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true // só para testes locais
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
    const { connection } = update;
    if (connection === 'close') {
      console.log('Conexão fechada, tentando reconectar...');
      setTimeout(() => startBot(), 5000);
    } else if (connection === 'open') {
      console.log('Bot conectado!');
    }
  });

  // Salva credenciais automaticamente
  sock.ev.on('creds.update', saveState);
}

// Inicia o bot
startBot();
