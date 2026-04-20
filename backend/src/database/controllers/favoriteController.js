const Favorite = require('../models/favoriteModel');

exports.getFavorites = async (req, res) => {
    try {
        const getUserId = (req) => Number(req.query.userId || req.body.userId || 1);
        const userId = getUserId(req);
        const favorites = await Favorite.getByUser(userId);
        res.status(200).json(favorites);
    } catch (err) { res.status(500).json({ error: err.message }); } 
};

exports.addFavorites = async (req, res) => {
    try {
        const userId = Number(req.body.userId || req.query.userId || 6);
        const { placeId } = req.body;
        if (!placeId) return res.status(400).json({ error: 'placeId is required' });

        const result = await Favorite.add(userId, placeId);
        if (!result) return res.status(409).json({ error: 'Already in favorites' });
        res.status(201).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); } 
};

exports.deleteFavorites = async (req, res) => {
    try {
        const userId = Number(req.body.userId || req.query.userId || 6);
        const { placeId } = req.params;
        const deleted = await Favorite.delete(userId, placeId);
        if (deleted === 0) {
            return res.status(404).json({ error: 'Favorite not found' });
        }
        res.status(204).send();
    } catch (err) { res.status(500).json({ error: err.message }); }
};