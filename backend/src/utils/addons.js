const Product = require('../models/Product');
const UserCart = require('../models/UserCart');

let ensureProductsSeededPromise = null;

const defaultProducts = [
  {
    name: 'Red Bull Energy Drink',
    description: 'Classic pre-game boost with quick energy support.',
    brand: 'Red Bull',
    category: 'Energy Drink',
    price: 120,
    imageUrl: 'https://images.unsplash.com/photo-1622484212850-eb596d769edc?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    popularityScore: 95,
    sportTags: ['Cricket', 'Basketball'],
    timeTags: ['Evening', 'Night'],
    locationTags: ['Chennai', 'Bengaluru'],
  },
  {
    name: 'Oats & Honey Bar',
    description: 'Light pre-session snack for steady energy.',
    brand: 'Nature Basket',
    category: 'Snack',
    price: 80,
    imageUrl: 'https://images.unsplash.com/photo-1571748982800-fa51082c2224?auto=format&fit=crop&w=800&q=80',
    rating: 4.3,
    popularityScore: 85,
    sportTags: ['Football', 'Badminton'],
    timeTags: ['Morning', 'Afternoon'],
    locationTags: ['Bengaluru', 'Madurai'],
  },
  {
    name: 'Banana Power Pack',
    description: 'Fast-digesting fruit pack ideal for racket sports.',
    brand: 'Fresh Court',
    category: 'Snack',
    price: 60,
    imageUrl: 'https://images.unsplash.com/photo-1574226516831-e1dff420e37f?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    popularityScore: 78,
    sportTags: ['Tennis', 'Badminton'],
    timeTags: ['Morning', 'Afternoon'],
    locationTags: ['Chennai', 'Coimbatore'],
  },
  {
    name: 'Tender Coconut Hydration',
    description: 'Electrolyte-heavy hydration for hot weather sessions.',
    brand: 'Chennai Fresh',
    category: 'Hydration',
    price: 90,
    imageUrl: 'https://images.unsplash.com/photo-1620052580945-8d8ef25d5ca8?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    popularityScore: 88,
    sportTags: ['Cricket', 'Football', 'Tennis'],
    timeTags: ['Morning', 'Afternoon', 'Evening'],
    locationTags: ['Chennai', 'Madurai', 'Tiruppur'],
  },
  {
    name: 'Bounce Energy Shot',
    description: 'Compact caffeine shot popular with evening league players.',
    brand: 'Bounce Energy',
    category: 'Energy Drink',
    price: 140,
    imageUrl: 'https://images.unsplash.com/photo-1543253687-c931c8e01820?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    popularityScore: 91,
    sportTags: ['Football', 'Volleyball', 'Basketball'],
    timeTags: ['Evening', 'Night'],
    locationTags: ['Bengaluru'],
  },
  {
    name: 'Paneer Power Sandwich',
    description: 'High-protein meal for late evening and night sessions.',
    brand: 'Urban Fuel',
    category: 'Meal',
    price: 180,
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    popularityScore: 83,
    sportTags: ['Cricket', 'Basketball', 'Volleyball'],
    timeTags: ['Evening', 'Night'],
    locationTags: ['Bengaluru', 'Chennai'],
  },
  {
    name: 'Millet Recovery Bowl',
    description: 'Warm post-game recovery meal with complex carbs.',
    brand: 'South Bowl',
    category: 'Recovery',
    price: 220,
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    popularityScore: 76,
    sportTags: ['Football', 'Cricket', 'Volleyball'],
    timeTags: ['Night'],
    locationTags: ['Chennai', 'Bengaluru', 'Madurai'],
  },
];

const sportCategoryMap = {
  Cricket: ['Energy Drink', 'Hydration'],
  Football: ['Snack', 'Recovery'],
  Tennis: ['Snack', 'Hydration'],
  Badminton: ['Snack', 'Hydration'],
  Basketball: ['Energy Drink', 'Recovery'],
  Volleyball: ['Energy Drink', 'Meal'],
};

const timeCategoryMap = {
  Morning: ['Snack', 'Hydration'],
  Afternoon: ['Snack', 'Hydration'],
  Evening: ['Energy Drink', 'Snack'],
  Night: ['Meal', 'Recovery'],
};

const hotCities = new Set(['Chennai', 'Madurai', 'Tiruppur']);

const inferTimeTag = (timeLabel = '') => {
  const match = timeLabel.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
  if (!match) {
    return 'Evening';
  }

  let hour = Number(match[1]) % 12;
  if (match[3].toUpperCase() === 'PM') {
    hour += 12;
  }

  if (hour < 12) {
    return 'Morning';
  }
  if (hour < 17) {
    return 'Afternoon';
  }
  if (hour < 21) {
    return 'Evening';
  }
  return 'Night';
};

const sanitizeText = (value = '') =>
  String(value)
    .replace(/[<>]/g, '')
    .trim();

const ensureProductsSeeded = async () => {
  if (!ensureProductsSeededPromise) {
    ensureProductsSeededPromise = (async () => {
      const count = await Product.countDocuments();
      if (count > 0) {
        return;
      }

      try {
        await Product.insertMany(defaultProducts, { ordered: false });
      } catch (error) {
        const insertedCount = await Product.countDocuments();
        if (insertedCount === 0) {
          throw error;
        }
      }
    })().finally(() => {
      ensureProductsSeededPromise = null;
    });
  }

  return ensureProductsSeededPromise;
};

const serializeCart = (entries) => {
  const items = entries
    .filter((entry) => entry.productId && typeof entry.productId.price === 'number')
    .map((entry) => ({
      id: entry.productId._id,
      name: entry.productId.name,
      brand: entry.productId.brand,
      price: Number(entry.productId.price.toFixed(2)),
      quantity: entry.quantity,
      image_url: entry.productId.imageUrl,
    }));

  return {
    items,
    total_items: items.reduce((sum, item) => sum + item.quantity, 0),
    total_price: Number(
      items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
    ),
  };
};

const getCartEntries = async (userId) =>
  UserCart.find({ userId }).populate('productId').sort({ addedAt: -1 });

const buildRecommendationScore = ({ product, context, cartEntries }) => {
  let score = product.popularityScore;

  if (product.sportTags.includes(context.sport)) {
    score += 45;
  }
  if (product.timeTags.includes(context.timeTag)) {
    score += 30;
  }
  if (product.locationTags.includes(context.city)) {
    score += 25;
  }

  const preferredCategories = sportCategoryMap[context.sport] || [];
  if (preferredCategories.includes(product.category)) {
    score += 25;
  }

  const timeCategories = timeCategoryMap[context.timeTag] || [];
  if (timeCategories.includes(product.category)) {
    score += 20;
  }

  if (context.weatherTag === 'hot' && ['Hydration', 'Energy Drink'].includes(product.category)) {
    score += 18;
  }

  const pastBrands = new Set(cartEntries.map((entry) => entry.productId.brand));
  const pastCategories = new Set(cartEntries.map((entry) => entry.productId.category));
  if (pastBrands.has(product.brand)) {
    score += 12;
  }
  if (pastCategories.has(product.category)) {
    score += 10;
  }

  return score;
};

const buildRecommendationContext = ({ booking, venue }) => {
  const sport = venue?.sportTypes?.[0] || 'Cricket';
  const city = venue?.city || 'Chennai';
  const timeTag = inferTimeTag(booking.slot?.timeLabel);
  const weatherTag = hotCities.has(city) ? 'hot' : 'mild';

  return {
    sport,
    city,
    timeTag,
    weatherTag,
  };
};

module.exports = {
  sanitizeText,
  ensureProductsSeeded,
  serializeCart,
  getCartEntries,
  buildRecommendationScore,
  buildRecommendationContext,
  inferTimeTag,
};
