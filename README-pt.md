- [Read this page in English](https://github.com/isaacgalmeida/telegram-webhook-n8n/blob/main/README.md)
- [Leia esta página em português](https://github.com/isaacgalmeida/telegram-webhook-n8n/blob/main/README-pt.md)

## Português

### Funcionalidades

- **Ouvinte de Mensagens:** Conecta ao Telegram utilizando as credenciais da API.
- **Encaminhamento do Payload:** Encaminha a mensagem completa (em formato JSON) para um URL de webhook configurado.
- **Notificações de Erro:** Em caso de falha no encaminhamento, envia os detalhes do erro para suas "Mensagens Salvas" no Telegram.

### Pré-requisitos

- Node.js (v14 ou superior)
- npm
- Credenciais da API do Telegram (`API_ID`, `API_HASH` e `SESSION_STRING`)
- Um URL de webhook válido (por exemplo, endpoint do n8n)

### Configuração

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/seuusuario/telegram-webhook-n8n.git
   cd telegram-webhook-n8n
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Crie um arquivo `.env`** na raiz do projeto com o seguinte conteúdo:

   ```env
   API_ID=seu_api_id
   API_HASH=seu_api_hash
   SESSION_STRING=sua_session_string
   WEBHOOK_URL=https://seu-endpoint-webhook.com/telegram
   ```

### Executando o Serviço

Inicie o serviço executando:

```bash
node index.js
```

O serviço se conectará ao Telegram, escutará novas mensagens e as encaminhará para o URL do webhook especificado.

### Docker

Você também pode executar o serviço utilizando Docker. Um exemplo de `Dockerfile` e `docker-compose.yml` está disponível.

#### Usando Docker Compose

1. Certifique-se de ter um arquivo `.env` com suas variáveis de ambiente.
2. Execute o seguinte comando:

   ```bash
   docker-compose up -d
   ```