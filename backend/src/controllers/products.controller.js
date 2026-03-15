const Product = require('../models/Product');
const {
  ensureProductsSeeded,
  getCartEntries,
  inferTimeTag,
  serializeCart,
} = require('../utils/addons');

exports.getProducts = async (req, res) => {
  try {
    await ensureProductsSeeded();

    const filters = {};
    if (req.query.sport) {
      filters.sportTags = req.query.sport;
    }
    if (req.query.city) {
      filters.locationTags = req.query.city;
    }
    if (req.query.time) {
      filters.timeTags = req.query.time;
    }

    const [products, cartEntries] = await Promise.all([
      Product.find(filters).sort({ popularityScore: -1, rating: -1 }),
      req.user?.id ? getCartEntries(req.user.id) : [],
    ]);

    const cartProductIds = new Set(cartEntries.map((entry) => String(entry.productId._id)));

    return res.json({
      success: true,
      data: {
        products: products.map((product) => ({
          id: product._id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: Number(product.price.toFixed(2)),
          image_url: product.imageUrl,
          rating: Number(product.rating.toFixed(1)),
          popularity_score: product.popularityScore,
          tags: [...product.sportTags, ...product.timeTags, ...product.locationTags],
          is_added: cartProductIds.has(String(product._id)),
        })),
        filters: {
          sport: req.query.sport || null,
          time: req.query.time || inferTimeTag(req.query.timeLabel),
          city: req.query.city || null,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
