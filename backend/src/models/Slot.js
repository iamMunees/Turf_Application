const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
      required: true,
    },
    slotDate: {
      type: String,
      required: true,
    },
    startMinutes: {
      type: Number,
      required: true,
    },
    endMinutes: {
      type: Number,
      required: true,
    },
    timeLabel: {
      type: String,
      required: true,
    },
    slotPrice: {
      type: Number,
      required: true,
    },
    maxPlayers: {
      type: Number,
      required: true,
    },
    slotDurationMinutes: {
      type: Number,
      required: true,
    },
    bookedPlayers: {
      type: Number,
      default: 0,
    },
    isFullSlotBooked: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['open', 'full'],
      default: 'open',
    },
  },
  {
    timestamps: true,
  },
);

slotSchema.index({ venue: 1, slotDate: 1, startMinutes: 1 }, { unique: true });

module.exports = mongoose.model('Slot', slotSchema);
