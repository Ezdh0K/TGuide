const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'email and password is necessary' });

        const existing = await User.getByEmail(email);
        if (existing) return res.status(409).json({ error: 'user already exists' });

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, passwordHash, role });

        const token = jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({
            user: {
                id: user.user_id,
                name: user.user_name,
                email: user.user_email,
                role: user.role
            }, token });
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const user = await User.getByEmail(email);
        if (!user)
            {
                console.log('!user: ', !user);
                return res.status(401).json({ error: 'This user not find' });
            }

            console.log('user object:', user);
console.log('password_hash field:', user?.password_hash);

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid)
            {
                console.log('!valid: ', !valid);
                return res.status(401).json({ error: 'not valid credentials' });
            }
            

        const token = jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({
            user: {
                id: user.user_id,
                name: user.user_name,
                email: user.user_email,
                role: user.role
            }, token });
    } catch (err) { res.status(500).json({ error: err.message }) }
};