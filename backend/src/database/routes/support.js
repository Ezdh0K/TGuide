const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

console.log('support yes');
router.post('/support', async (req, res) => {
    console.log('✅ Запрос получен на /support');
    console.log('📦 Тело запроса:', req.body);
    const { email, name, letter } = req.body;

    console.log('MY_PASS from env:', process.env.MY_PASS ? 'exists' : 'MISSING');

    const transporter = nodemailer.createTransport({
        host: 'smtp.yandex.ru',
        port: 587,
        secure: false,
        auth: {
            user: 'udergadc',            // например, 'myapp' (без '@yandex.ru')
            pass: process.env.MY_PASS,     // пароль приложения из переменной окружения
        },
        family: 4,
    });
    const mailOptions = {
        from: '"Техподдержка" <udergadc@yandex.ru>',
        to: 'udergadc@yandex.ru',
        subject: `Сообщение от ${name}`,
        text: letter,
        replyTo: email,
    };
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Письмо отправлено' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Ошибка отправки' });
    }
});

module.exports = router;