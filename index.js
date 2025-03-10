require('dotenv').config();
const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { NewMessage } = require('telegram/events');
const axios = require('axios');

// Load environment variables
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
    
    const payload = {
      messageId: message.id,
      text: message.message,
      photo: message.photo ? message.photo.toJSON() : null,
    };

    try {
      await axios.post(webhookUrl, payload);
      console.log('Message forwarded to webhook.');
    } catch (error) {
      console.error('Error forwarding message:', error);

      // Send error details to your Telegram "Saved Messages"
      await client.sendMessage("me", { message: `Error forwarding message: ${error.message || error}` });
      console.log('Error message sent to self.');
    }
  }, new NewMessage({}));

  console.log('Listening for new messages...');
})();
