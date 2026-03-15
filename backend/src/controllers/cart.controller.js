const Product = require('../models/Product');
const UserCart = require('../models/UserCart');
const { ensureProductsSeeded, getCartEntries, serializeCart } = require('../utils/addons');

const cartRateLimits = new Map();

const assertCartRateLimit = (userId) => {
  const now = Date.now();
  const key = String(userId);
  const current = cartRateLimits.get(key) || [];
  const recent = current.filter((timestamp) => now - timestamp < 60 * 1000);

  if (recent.length >= 10) {
    return false;
  }

  recent.push(now);
  cartRateLimits.set(key, recent);
  return true;
};

exports.addToCart = async (req, res) => {
  try {
    if (!assertCartRateLimit(req.user.id)) {
      return res.status(429).json({ success: false, message: 'Too many cart updates. Try again shortly.' });
    }

    await ensureProductsSeeded();

    const product = await Product.findById(req.body.productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const quantity = Math.max(1, Number.parseInt(req.body.quantity || 1, 10));
    const existingEntry = await UserCart.findOne({ userId: req.user.id, productId: product._id });

    if (existingEntry) {
      existingEntry.quantity += quantity;
      await existingEntry.save();
    } else {
      await UserCart.create({
        userId: req.user.id,
        productId: product._id,
        quantity,
      });
    }

    const entries = await getCartEntries(req.user.id);

    return res.status(201).json({
      success: true,
      data: {
        cart: serializeCart(entries),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    await ensureProductsSeeded();
    const entries = await getCartEntries(req.user.id);

    return res.json({
      success: true,
      data: {
        cart: serializeCart(entries),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    if (!assertCartRateLimit(req.user.id)) {
      return res.status(429).json({ success: false, message: 'Too many cart updates. Try again shortly.' });
    }

    await UserCart.findOneAndDelete({
      userId: req.user.id,
      productId: req.params.productId,
    });

    const entries = await getCartEntries(req.user.id);

    return res.json({
      success: true,
      data: {
        cart: serializeCart(entries),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    if (!assertCartRateLimit(req.user.id)) {
      return res.status(429).json({ success: false, message: 'Too many cart updates. Try again shortly.' });
    }

    const quantity = Math.max(1, Number.parseInt(req.body.quantity || 1, 10));

    const entry = await UserCart.findOne({
      userId: req.user.id,
      productId: req.params.productId,
    });

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Cart item not found.' });
    }

    entry.quantity = quantity;
    await entry.save();

    const entries = await getCartEntries(req.user.id);

    return res.json({
      success: true,
      data: {
        cart: serializeCart(entries),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
