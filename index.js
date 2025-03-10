require('dotenv').config();
const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { NewMessage } = require('telegram/events');
const axios = require('axios');

// Carrega as variáveis de ambiente
const apiId = parseInt(process.env.API_ID, 10);
const apiHash = process.env.API_HASH;
const stringSession = new StringSession(process.env.SESSION_STRING);
const webhookUrl = process.env.WEBHOOK_URL;

const client = new TelegramClient(stringSession, apiId, apiHash, {
  connectionRetries: 5,
});

(async () => {
  await client.start();
  console.log('Telegram client iniciado!');

  client.addEventHandler(async (event) => {
    const message = event.message;
    
    const payload = {
      messageId: message.id,
      text: message.message,
      photo: message.photo ? message.photo.toJSON() : null,
    };

    try {
      await axios.post(webhookUrl, payload);
      console.log('Mensagem encaminhada para o webhook.');
    } catch (error) {
      console.error('Erro ao encaminhar mensagem:', error);
    }
  }, new NewMessage({}));

  console.log('Ouvindo novas mensagens...');
})();
