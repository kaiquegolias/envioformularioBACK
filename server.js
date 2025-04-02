require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do serviço de e-mail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Seu e-mail
        pass: process.env.EMAIL_PASS, // Sua senha (ou app password do Gmail)
    },
});

// Teste de conexão com o e-mail
transporter.verify((error, success) => {
    if (error) {
        console.error("Erro ao conectar ao e-mail:", error);
    } else {
        console.log("Servidor de e-mail pronto para enviar mensagens!");
    }
});

// Rota para receber o formulário
app.post("/contato", async (req, res) => {
    const { nome, email, duvida } = req.body;

    if (!nome || !email || !duvida) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
    }

    try {
        console.log("Recebendo contato de:", email);

        // 1️⃣ E-mail para o administrador (você)
        const adminMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_DESTINO, // Seu e-mail de destino
            subject: "Novo contato pelo formulário!",
            text: `Nome: ${nome}\nE-mail: ${email}\nDúvida: ${duvida}`,
        };

        // 2️⃣ E-mail de resposta automática para o usuário
        const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: email, // E-mail do usuário
            subject: "Recebemos seu contato!",
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <img src="cid:minhaLogo" alt="Logo" style="width: 150px; margin-bottom: 10px;">
                    <h2 style="color: #333;">Olá, ${nome}!</h2>
                    <p style="color: #555;">Agradecemos o seu contato. Em breve, responderemos à sua dúvida.</p>
                    <p style="font-size: 12px; color: #888;">Esta é uma mensagem automática. Por favor, não responda.</p>
                    <p style="color: #555;"><strong>Para suporte urgente, ligue para: (xx) xxxxx-xxxx</strong></p>
                </div>
            `,
            attachments: [{
                filename: "logo.png",
                path: path.join(__dirname, "logo.png"), // Certifique-se de que a logo está na pasta do projeto
                cid: "minhaLogo" // ID para referenciar a imagem no HTML
            }]
        };

        // Enviar os dois e-mails
        await transporter.sendMail(adminMailOptions);
        console.log("E-mail para o administrador enviado!");

        await transporter.sendMail(userMailOptions);
        console.log("E-mail de agradecimento enviado para:", email);

        res.status(200).json({ message: "Contato enviado com sucesso!" });
    } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
        res.status(500).json({ message: "Erro ao enviar e-mail", error: error.message });
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
