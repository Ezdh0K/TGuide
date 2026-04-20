const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');

router.get('/', favoriteController.getFavorites);
router.post('/', favoriteController.addFavorites);
router.delete('/:placeId', favoriteController.deleteFavorites);

module.exports = router;