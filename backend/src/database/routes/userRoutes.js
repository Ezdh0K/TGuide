const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/', userController.getUsers);
router.get('/id', userController.getUser);
router.post('/', userController.createUser);
router.put('/password', requireAuth, userController.updateUserPassword);
router.put('/email', requireAuth, userController.updateUserEmail);
router.delete('/', requireAuth, userController.deleteUser);

module.exports = router;