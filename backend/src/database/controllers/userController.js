const pool = require('../config/db');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
// const axios = require('axios');

// const sendEmail = async (to, subject, html) => {
//     const params = new URLSearchParams({
//         format: 'json',
//         api_key: process.env.UNISENDER_API_KEY,
//         email: to,
//         sender_name: process.env.UNISENDER_SENDER_NAME || 'TGuide',
//         sender_email: process.env.UNISENDER_SENDER_EMAIL, // подтвержденный адрес
//         subject,
//         body: html,
//         list_id: process.env.UNISENDER_LIST_ID, // нужен для ссылки отписки
//         track_read: '0',
//         track_links: '0',
//     });

//     const url = 'https://api.unisender.com/ru/api/sendEmail';
//     console.log('TO:', to);
//     console.log('SENDER:', process.env.UNISENDER_SENDER_EMAIL);
//     console.log('API KEY PREFIX:', process.env.UNISENDER_API_KEY?.slice(0, 6));
//     const { data } = await axios.post(url, params, {
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     });

//     return data;
// };

exports.getUsers = async (req, res) => {
    try {
        const user = await User.get();
        res.status(200).json(user);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.getById();
        res.status(200).json(user);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        // Проверка, что пароль передан
        if (!password) return res.status(400).json({ error: 'Пароль обязателен' });
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, passwordHash, role });
        res.status(201).json(user);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateUserPassword = async (req, res) => {
    try {
        const userId = req.user.id || req.user.sub;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword)
            { return res.status(400).json({ message: 'Old and new password are required' }); }

        if (newPassword.length < 6)
            { return res.status(400).json({ message: 'New password must be at least 6 characters' }); }

        const user = await User.getById(userId);
        if (!user)
            { return res.status(404).json({ message: 'user not found' }) }

        const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
        if (!isMatch)
            { return res.status(401).json({ message: 'Current password is incorrect' }); }

        const newHash = await bcrypt.hash(newPassword, 10);
        await User.updatePassword({userId, newHash});

        res.status(200).json({ message: 'Password changed successfully' });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateUserEmail = async (req, res) => {
    try {
        const userId = req.user.id || req.user.sub;
        if (!userId) return res.status(401).json({ message: 'Unautorizated' });

        const { newEmail } = req.body;
        if (!newEmail) return res.status(400).json({ message: 'newEmail is required' });

        const user = await User.getById(userId);
        if (!user) return res.status(404).json({ message: 'user not found' });

        const existingUser = await User.getByEmail(newEmail);
        if (existingUser) {
            return res.status(409).json({ error: 'Этот email уже зарегистрирован' });
        }

        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ ok: false, error: 'password required' });
        }
        if (!user?.password_hash) {
            return res.status(500).json({ ok: false, error: 'password hash missing' });
        }
        console.log('password?', !!password);
        console.log('user?', !!user);
        console.log('has hash?', !!user?.password_hash);

        const ok = await bcrypt.compare(password, user.password_hash);
        await User.updateEmail({ userId, newEmail });
        
        return res.status(200).json({ ok });
    } catch (err) { return res.status(500).json({ ok: false, error: 'server error' }); }
};

// exports.confirmEmailChange = async (req, res) => {
//     try {
//         const { token } = req.body;
//         if (!token) return res.status(400).json({ error: 'Токен обязателен' });

//         const tokenRecord = await User.getToken(token);
//         if (!tokenRecord) {
//             return res.status(400).json({ error: 'Недействительный или устаревший токен' });
//         }

//         if (new Date() > new Date(tokenRecord.expires_at)) {
//             return res.status(400).json({ error: 'Срок действия токена истёк' });
//         }

//         const updatedUser = await User.updateEmail({
//             userId: tokenRecord.user_id,
//             token,
//             newEmail: tokenRecord.new_email,
//         });

//         res.status(200).json({ message: 'Email успешно изменён', user: updatedUser });
//     } catch (err) {
//         console.error('Ошибка подтверждения email:', err);
//         res.status(500).json({ error: 'Ошибка сервера' });
//     }
// };

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.sub;
        if (!userId) { return res.status(401).json({ error: 'Unauthorized' }) }

        const deleted = await User.delete({ id: userId });
        if (deleted === 0) { return res.status(404).json({ message: 'User not found' }); }

        res.status(200).json({ message: 'succesfuly deleted' })
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};