const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['player', 'organizer', 'fan'],
      required: true,
    },
    favoriteSports: {
      type: [String],
      default: [],
    },
    phone: {
      type: String,
      trim: true,
    },
    city: String,
    avatarUrl: String,
    bio: String,
    skillLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Pro'],
      default: 'Intermediate',
    },
    playingPosition: {
      type: String,
      default: 'Utility',
      trim: true,
    },
    sportType: {
      type: String,
      enum: ['Cricket', 'Badminton', 'Tennis', 'Football', 'Basketball', 'Volleyball', 'Pickleball'],
    },
    playerType: {
      type: String,
      enum: ['Fun Player', 'Skill Player', 'Team Player', 'Star Performer'],
    },
    level: {
      type: String,
      enum: ['Local', 'State', 'National'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isRisingStar: {
      type: Boolean,
      default: false,
    },
    trainingOffered: {
      type: Boolean,
      default: false,
    },
    trainingPrice: {
      type: Number,
      default: 0,
    },
    trainingSlots: [
      {
        day: String,
        time: String,
      },
    ],
    followersCount: {
      type: Number,
      default: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    clubs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
      },
    ],
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', function setUsername(next) {
  if (!this.username && this.email) {
    this.username = this.email.split('@')[0].toLowerCase();
  }

  next();
});

module.exports = mongoose.model('User', userSchema);
