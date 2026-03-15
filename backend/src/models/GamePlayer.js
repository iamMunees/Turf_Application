const mongoose = require('mongoose');

const gamePlayerSchema = new mongoose.Schema(
  {
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'paid',
    },
    paymentReference: {
      type: String,
      trim: true,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    skillLevel: {
      type: String,
      default: 'Intermediate',
      trim: true,
    },
    playingPosition: {
      type: String,
      default: 'Utility',
      trim: true,
    },
    isHost: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

gamePlayerSchema.index({ gameId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('GamePlayer', gamePlayerSchema);
