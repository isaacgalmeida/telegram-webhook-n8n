require('dotenv').config();
const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { NewMessage } = require('telegram/events');
const axios = require('axios');
const { Api } = require('telegram/tl');

const apiId = parseInt(process.env.API_ID, 10);
const apiHash = process.env.API_HASH;
const stringSession = new StringSession(process.env.SESSION_STRING);
const webhookUrl = process.env.WEBHOOK_URL;

const client = new TelegramClient(stringSession, apiId, apiHash, {
  connectionRetries: 5,
});

// Função para reconstruir a formatação original da mensagem
function formatMessage(text, entities) {
  if (!entities || !text) return text;

  let formattedText = text;
  let offsetCorrection = 0;

  // Ordena as entidades pelo offset para evitar problemas de deslocamento
  entities.sort((a, b) => a.offset - b.offset);

  entities.forEach(entity => {
    let start = entity.offset + offsetCorrection;
    let end = start + entity.length;
    let entityText = formattedText.substring(start, end);

    switch (entity.className) {
      case 'MessageEntityBold':
        entityText = `*${entityText}*`;
        break;
      case 'MessageEntityItalic':
        entityText = `_${entityText}_`;
        break;
      case 'MessageEntityUnderline':
        entityText = `__${entityText}__`;
        break;
      case 'MessageEntityStrike':  // 💡 Adicionando suporte a tachado
        entityText = `~~${entityText}~~`;
        break;
      case 'MessageEntityCode':
        entityText = `\`${entityText}\``;
        break;
      case 'MessageEntityPre':
        entityText = `\`\`\`${entityText}\`\`\``;
        break;
      case 'MessageEntityUrl':
        entityText = `[${entityText}](${entity.url || entityText})`;
        break;
      case 'MessageEntityTextUrl':
        entityText = `[${entityText}](${entity.url})`;
        break;
      default:
        return;
    }

    // Atualiza o texto formatado com a nova entidade aplicada
    formattedText =
      formattedText.substring(0, start) +
      entityText +
      formattedText.substring(end);

    // Ajusta o deslocamento devido ao novo tamanho do texto formatado
    offsetCorrection += entityText.length - entity.length;
  });

  return formattedText;
}

(async () => {
  await client.start();
  console.log('Telegram client started!');

  client.addEventHandler(async (event) => {
    const message = event.message;

    // Converte o objeto da mensagem para JSON
    const payload = message.toJSON();

    // Formata a mensagem mantendo a formatação original
    payload.formattedMessage = formatMessage(message.message, message.entities);

    // Se a mensagem contiver mídia do tipo foto, baixa a imagem e adiciona ao payload
    if (message.media && message.media.photo) {
      try {
        const photoBuffer = await client.downloadMedia(message.media);
        // Anexa a foto codificada em base64 no payload (pode ser enviada para o webhook)
        payload.photoBase64 = photoBuffer.toString('base64');

        // Formata a legenda (caption) mantendo a formatação
        if (message.caption) {
          payload.formattedCaption = formatMessage(
            message.caption,
            message.captionEntities
          );
        }
      } catch (err) {
        console.error("Error downloading photo:", err);
      }
    }

    try {
      await axios.post(webhookUrl, payload);
      console.log('Message forwarded to webhook with formatting.');
    } catch (error) {
      console.error('Error forwarding message:', error);
      await client.sendMessage("me", { message: `Error forwarding message: ${error.message || error}` });
      console.log('Error message sent to self.');
    }
  }, new NewMessage({}));

  console.log('Listening for new messages...');
})();
