const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const usersController = require('../controllers/users.controller');

const router = express.Router();

router.get('/me', authMiddleware, usersController.getCurrentUser);
router.get('/:id', authMiddleware, usersController.getUserById);
router.put('/update', authMiddleware, usersController.updateCurrentUser);
router.post('/follow/:id', authMiddleware, usersController.toggleFollowUser);

module.exports = router;
