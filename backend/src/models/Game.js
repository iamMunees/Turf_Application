const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    sport: {
      type: String,
      required: true,
      trim: true,
    },
    format: {
      type: String,
      required: true,
      trim: true,
    },
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
      required: true,
    },
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Slot',
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
      trim: true,
    },
    endTime: {
      type: String,
      required: true,
      trim: true,
    },
    maxPlayers: {
      type: Number,
      required: true,
      min: 2,
    },
    currentPlayers: {
      type: Number,
      default: 1,
      min: 1,
    },
    pricePerPlayer: {
      type: Number,
      required: true,
      min: 0,
    },
    visibility: {
      type: String,
      enum: ['public', 'friends', 'club'],
      default: 'public',
    },
    inviteMeta: {
      allowInvites: {
        type: Boolean,
        default: true,
      },
      friendsOnly: {
        type: Boolean,
        default: false,
      },
      clubId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
      },
      inviteCode: {
        type: String,
        trim: true,
      },
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    distanceKm: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['upcoming', 'full', 'completed', 'cancelled'],
      default: 'upcoming',
    },
  },
  {
    timestamps: true,
  },
);

gameSchema.index({ sport: 1, date: 1, startTime: 1 });

module.exports = mongoose.model('Game', gameSchema);
