# API Brasa — Leonardo Brasil

API de suporte ao aplicativo Brasa. A publicação do catálogo descreve as rotas existentes e não concede autorização de uso externo. Para integrar, consulte contato@leonardobrasil.com.br.

[Especificação OpenAPI](https://leonardobrasil.com.br/openapi.json).

- `GET /api/health`: retorna `ok`, `version`, `integrations` e `runtime`. Indica configuração, não a disponibilidade dos provedores.
- `POST /api/anthropic/messages`: JSON com `userText`, `messages` e `systemPrompt`; processamento de mensagens conforme provedor configurado.
- `POST /api/elevenlabs/tts`: JSON com `text`; retorna áudio com tipo de mídia conforme provedor configurado.
- `POST /api/stt/transcribe`: áudio binário com seu Content-Type; retorna transcrição.
- `POST /api/webhooks/automation`: objeto JSON encaminhado à automação configurada.

As operações dependem da configuração do servidor. Não envie credenciais dos provedores pelo navegador. O catálogo não altera as regras de acesso existentes.
