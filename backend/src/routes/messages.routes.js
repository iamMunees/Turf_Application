const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const messagesController = require('../controllers/messages.controller');

const router = express.Router();

router.get('/', authMiddleware, messagesController.getMessages);
router.post('/send', authMiddleware, messagesController.sendMessage);
router.post('/clubs', authMiddleware, messagesController.createClub);

module.exports = router;
