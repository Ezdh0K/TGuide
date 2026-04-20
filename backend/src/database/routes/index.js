const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const placeRoutes = require('./placeRoutes');
const favoriteRoutes = require('./favoriteRoutes');
const historyRoutes = require('./historyRoutes');
const authRoutes = require('./authRoutes');

router.use('/users', userRoutes);
router.use('/places', placeRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/history', historyRoutes);
router.use('/auth', authRoutes);

module.exports = router;