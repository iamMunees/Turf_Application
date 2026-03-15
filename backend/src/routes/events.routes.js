const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const eventsController = require('../controllers/events.controller');

const router = express.Router();

router.get('/', eventsController.getEvents);
router.get('/:eventId', eventsController.getEventById);
router.post('/', authMiddleware, eventsController.createEvent);
router.post('/:eventId/register', authMiddleware, eventsController.registerForEvent);

module.exports = router;
