const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    sport: {
      type: String,
      enum: ['Football', 'Cricket', 'Badminton'],
      required: true,
    },
    description: String,
    location: String,
    bannerUrl: String,
    startsAt: Date,
    endsAt: Date,
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    teams: {
      type: [String],
      default: [],
    },
    schedule: [
      {
        label: String,
        slot: String,
      },
    ],
    registeredUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Event', eventSchema);
