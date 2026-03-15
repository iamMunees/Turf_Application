const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    sport: {
      type: String,
      enum: ['Football', 'Cricket', 'Badminton'],
      required: true,
    },
    location: {
      city: String,
      address: String,
    },
    slotDurationMinutes: {
      type: Number,
      default: 60,
    },
    amenities: {
      type: [String],
      default: [],
    },
    pricePerSlot: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Facility', facilitySchema);
