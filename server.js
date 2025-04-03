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
transporter.verify((error) => {
    if (error) {
        console.error("Erro ao conectar ao e-mail:", error);
    } else {
        console.log("Servidor de e-mail pronto para enviar mensagens! 🚀🚀🚀");
    }
});

// Função para gerar um ID aleatório de 4 dígitos
const gerarID = () => Math.floor(1000 + Math.random() * 9000);

// Rota para receber o formulário
app.post("/falaconosco", async (req, res) => {
    const { nome, email, duvida } = req.body;

    if (!nome || !email || !duvida) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
    }

    try {
        const idContato = gerarID(); // Gerar ID aleatório

        console.log(`Recebendo contato de: ${email} | ID: ${idContato}`);

        // E-mail para o administrador
        const adminMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_DESTINO,
            subject: `📩 Novo contato pelo Fale Conosco #${idContato}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background-color: #f4f7f9; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
                    
                    <header style="background-color: #007bff; color: white; padding: 15px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                        <h2 style="margin: 0; font-size: 20px;">📩 Novo Contato - Fale Conosco #${idContato}</h2>
                    </header>

                    <main style="padding: 20px; background-color: white; border-radius: 10px;">
                        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                            Você recebeu uma nova mensagem através do <strong>Fale Conosco</strong>. Confira os detalhes abaixo:
                        </p>

                        <div style="padding: 15px; border-left: 5px solid #007bff; background-color: #f1f5f9; border-radius: 5px;">
                            <p><strong>📌 ID do Contato:</strong> ${idContato}</p>
                            <p><strong>👤 Nome:</strong> ${nome}</p>
                            <p><strong>📧 E-mail:</strong> <a href="mailto:${email}" style="color: #007bff; text-decoration: none;">${email}</a></p>
                            <p><strong>📝 Mensagem:</strong></p>
                            <blockquote style="margin: 10px 0; padding: 10px; background: #e9f1ff; border-left: 4px solid #007bff; font-style: italic; color: #444;">
                                ${duvida}
                            </blockquote>
                        </div>
                    </main>

                    <footer style="text-align: center; font-size: 12px; color: #777; margin-top: 20px;">
                        <p>💼 <strong>Fale Conosco - Sistema Corporativo</strong></p>
                        <p><strong>📅 Recebido em:</strong> ${new Date().toLocaleString("pt-BR")}</p>
                    </footer>
                </div>
            `,
        };

        const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Recebemos seu contato #${idContato}!`,
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <img src="cid:minhaLogo" alt="Logo" style="width: 150px; margin-bottom: 10px;">
                    <h2 style="color: #333;">Olá, ${nome}!</h2>
                    <p style="color: #555;">Agradecemos o seu contato. Em breve, responderemos à sua dúvida.</p>
                    <p><strong>📌 ID do Contato:</strong> ${idContato}</p>
                    <p style="font-size: 12px; color: #888;">Esta é uma mensagem automática. Por favor, não responda.</p>
                    <p style="color: #555;"><strong>Para suporte urgente, ligue para: (xx) xxxxx-xxxx</strong></p>
                </div>
            `,
            attachments: [{
                filename: "logo.png",
                path: path.join(__dirname, "logo.png"), // Garante que a logo está na pasta do projeto
                cid: "minhaLogo" // ID para referenciar a imagem no HTML
            }]
        };
        

        // Enviar os dois e-mails
        await transporter.sendMail(adminMailOptions);
        console.log(`E-mail para o administrador enviado! (ID: ${idContato})`);

        await transporter.sendMail(userMailOptions);
        console.log(`E-mail de agradecimento enviado para: ${email} (ID: ${idContato})`);

        res.status(200).json({ message: "Contato enviado com sucesso!", idContato });
    } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
        res.status(500).json({ message: "Erro ao enviar e-mail", error: error.message });
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
