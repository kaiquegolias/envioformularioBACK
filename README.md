# 📧 Nodemailer Gmail Sender

Projeto para envio de e-mails utilizando Nodemailer com autenticação OAuth2 do Gmail.

## 📋 Pré-requisitos

- Node.js (v18 ou superior)
- Conta Google/Gmail com verificação em 2 etapas ativada
- NPM ou Yarn

## ⚙️ Configuração

### 🔐 Criando credenciais de aplicativo

1. Ative a verificação em 2 etapas:
   - Acesse [Google Account Security](https://myaccount.google.com/security)
   - Ative "Verificação em duas etapas"

2. Crie uma senha de aplicativo:
   - Acesse [App Passwords](https://myaccount.google.com/apppasswords)
   - Selecione "Outro (Nome personalizado)"
   - Digite um nome (ex: "NodeMailer App")
   - Clique em "Gerar"
   - Copie a senha de 16 caracteres (formato: `xxxx xxxx xxxx xxxx`)

### 🛠 Configurando ambiente

1. Renomeie `.env.example` para `.env`
2. Preencha com suas credenciais:

```env
# Configurações do Gmail
GMAIL_USER=seuemail@gmail.com
GMAIL_APP_PASSWORD=senha_de_aplicativo_gerada  # (ex: abcd efgh ijkl mnop)

# Destinatário padrão
EMAIL_TO=destinatario@exemplo.com

🚀 Como usar

# Instalar dependências
npm install

# Executar aplicação
npm start

# Executar em modo desenvolvimento
npm run dev

📝 Licença
Este projeto está licenciado sob a MIT License - veja o arquivo LICENSE para detalhes.

<div align="center"> Feito com ❤️ por [Golias] </div> ```
