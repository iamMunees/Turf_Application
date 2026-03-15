const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const bookingsController = require('../controllers/bookings.controller');

const router = express.Router();

router.get('/availability', bookingsController.getAvailability);
router.get('/mine', authMiddleware, bookingsController.getMyBookings);
router.post('/:bookingId/addons', authMiddleware, bookingsController.getBookingAddOns);
router.post('/', authMiddleware, bookingsController.createBooking);

module.exports = router;
