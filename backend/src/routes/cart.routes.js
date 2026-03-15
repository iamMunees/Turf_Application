const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const cartController = require('../controllers/cart.controller');

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

router.post('/', authMiddleware, cartController.addToCart);
router.get('/', disableCache, authMiddleware, cartController.getCart);
router.patch('/:productId', authMiddleware, cartController.updateCartItem);
router.delete('/:productId', authMiddleware, cartController.removeFromCart);

module.exports = router;
