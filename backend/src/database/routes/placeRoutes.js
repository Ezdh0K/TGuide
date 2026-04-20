const express = require('express');
const multer = require('multer');
const placeController = require('../controllers/placeController');
const { upload } = require('../middleware/imageMiddleware')

const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.get('/', placeController.getPlaces);
router.get('/:id', placeController.getPlaceById);
router.post('/', requireAuth, requireRole('admin'), upload.single('image'), placeController.upsertPlace);
router.put('/:id', placeController.updatePlace);
router.delete('/:id', placeController.deletePlace);

module.exports = router;