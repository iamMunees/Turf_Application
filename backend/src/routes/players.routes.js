const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const playersController = require('../controllers/players.controller');

const router = express.Router();

router.get('/', playersController.getPlayers);
router.get('/:id', playersController.getPlayerProfile);
router.post('/:id/follow', authMiddleware, playersController.toggleFollowPlayer);
router.get('/:id/followers', playersController.getFollowers);
router.get('/:id/following', playersController.getFollowing);
router.post('/:id/invite', authMiddleware, playersController.sendInvite);
router.post('/:id/book', authMiddleware, playersController.bookTraining);
router.get('/:id/bookings', authMiddleware, playersController.getPlayerBookings);
router.post('/:id/bookings/:bookingId/cancel', authMiddleware, playersController.cancelBooking);

module.exports = router;
