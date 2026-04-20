const History = require('../models/historyModel');

exports.getHistory = async (req, res) => {
    try {
        const userId = req.body?.userId || req.query?.userId || req.user?.id;
        const limit = req.query.limit || 50;
        const history = await History.getByUser(userId, limit);
        res.status(200).json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addHistory = async (req, res) => {
    try {
        const userId = req.body?.userId || req.query?.userId || req.user?.id;
        const { placeId } = req.body;
        if (!userId || !placeId) return res.status(400).json({ error: 'userId and placeId required' });

        const record = await History.upsert(userId, placeId);
        res.status(201).json(record);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.clearOld = async (req, res) => {
    try {
        const userId = req.user?.sub || req.user?.id || req.body?.userId || req.query?.userId;
        const days = Number(req.query?.days || req.body?.days || 30);

        if (!userId) {
            return res.status(400).json({ error: 'userId required' });
        }

        const deleted = await History.clearOld(userId, days);
        res.status(200).json({ deleted });
    } catch (err) { res.status(500).json({ error: err.message }); }
        
};