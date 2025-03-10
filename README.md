- [Read this page in English](https://github.com/isaacgalmeida/telegram-webhook-n8n/blob/main/README.md)
- [Leia esta página em português](https://github.com/isaacgalmeida/telegram-webhook-n8n/blob/main/README-PT.md)

# Telegram Webhook n8n

A Node.js integration service that listens for incoming Telegram messages (including media) using Telegram API credentials and forwards the entire message payload to a specified webhook endpoint (e.g., n8n). In case of errors during forwarding, the error details are sent directly to your Telegram "Saved Messages".

---

## English

### Features

- **Message Listener:** Connects to Telegram using provided API credentials.
- **Payload Forwarding:** Forwards the entire message (as JSON) to a configurable webhook URL.
- **Error Notifications:** Sends error details to your Telegram "Saved Messages" if the forwarding fails.

### Prerequisites

- Node.js (v14 or later)
- npm
- Telegram API credentials (`API_ID`, `API_HASH`, and `SESSION_STRING`)
- A valid webhook URL (e.g., n8n webhook endpoint)

### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/telegram-webhook-n8n.git
   cd telegram-webhook-n8n
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory with the following content:

   ```env
   API_ID=your_api_id
   API_HASH=your_api_hash
   SESSION_STRING=your_session_string
   WEBHOOK_URL=https://your-webhook-url.com/telegram
   ```

### Running the Service

Start the service by running:

```bash
node index.js
```

The service will connect to Telegram, listen for new messages, and forward them to the specified webhook URL.

### Docker

You can also run the service using Docker. A sample `Dockerfile` and `docker-compose.yml` are provided.

#### Using Docker Compose

1. Ensure you have a `.env` file with your environment variables.
2. Run the following command:

   ```bash
   docker-compose up -d
   ```