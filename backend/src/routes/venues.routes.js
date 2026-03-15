const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const venuesController = require('../controllers/venues.controller');

const router = express.Router();

const disableCache = (_req, res, next) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
    'Surrogate-Control': 'no-store',
  });
  next();
};

router.get('/bootstrap', disableCache, venuesController.bootstrap);
router.get('/filters', disableCache, venuesController.getVenueFilters);
router.get('/', disableCache, venuesController.listVenues);
router.get('/:venueId', disableCache, venuesController.getVenueById);
router.get('/:venueId/slots', disableCache, venuesController.getVenueSlots);
router.post('/:venueId/reviews', authMiddleware, venuesController.createReview);

module.exports = router;
