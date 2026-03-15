const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Energy Drink', 'Snack', 'Meal', 'Hydration', 'Recovery'],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imageUrl: String,
    rating: {
      type: Number,
      default: 0,
    },
    popularityScore: {
      type: Number,
      default: 0,
    },
    sportTags: {
      type: [String],
      default: [],
    },
    timeTags: {
      type: [String],
      default: [],
    },
    locationTags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
