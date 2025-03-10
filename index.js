require('dotenv').config();
const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { NewMessage } = require('telegram/events');
const axios = require('axios');

const apiId = parseInt(process.env.API_ID, 10);
const apiHash = process.env.API_HASH;
const stringSession = new StringSession(process.env.SESSION_STRING);
const webhookUrl = process.env.WEBHOOK_URL;

const client = new TelegramClient(stringSession, apiId, apiHash, {
  connectionRetries: 5,
});

(async () => {
  await client.start();
  console.log('Telegram client started!');

  client.addEventHandler(async (event) => {
    const message = event.message;
    
    // Converte o objeto da mensagem para JSON
    const payload = message.toJSON();

    // Se a mensagem contiver mídia do tipo foto, baixa a imagem e adiciona ao payload
    if (message.media && message.media.photo) {
      try {
        const photoBuffer = await client.downloadMedia(message.media);
        // Anexa a foto codificada em base64 no payload (pode ser enviada para o webhook)
        payload.photoBase64 = photoBuffer.toString('base64');
      } catch (err) {
        console.error("Error downloading photo:", err);
      }
    }

    try {
      await axios.post(webhookUrl, payload);
      console.log('Message forwarded to webhook.');
    } catch (error) {
      console.error('Error forwarding message:', error);
      // Envia detalhes do erro para "Mensagens Salvas"
      await client.sendMessage("me", { message: `Error forwarding message: ${error.message || error}` });
      console.log('Error message sent to self.');
    }
  }, new NewMessage({}));

  console.log('Listening for new messages...');
})();
