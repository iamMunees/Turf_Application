const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Comment = require('../models/Comment');
const Event = require('../models/Event');
const Follow = require('../models/Follow');
const Game = require('../models/Game');
const GameComment = require('../models/GameComment');
const GamePlayer = require('../models/GamePlayer');
const Message = require('../models/Message');
const Post = require('../models/Post');
const User = require('../models/User');
const { ensureGameSeedData } = require('./games.controller');

const SPORT_OPTIONS = ['Football', 'Cricket', 'Badminton', 'Tennis', 'Basketball', 'Volleyball', 'Pickleball'];

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const ensureUsername = async (user) => {
  if (!user) {
    return null;
  }

  if (!user.username && user.email) {
    user.username = user.email.split('@')[0].toLowerCase();
    await user.save();
  }

  return user;
};

const buildRecentActivity = async (userId) => {
  const [joinedGames, hostedGames, bookings, events, posts, messages, postComments, gameComments] =
    await Promise.all([
      GamePlayer.find({ userId }).populate('gameId', 'title sport createdAt date').sort({ createdAt: -1 }).limit(3),
      Game.find({ hostId: userId }).sort({ createdAt: -1 }).limit(3),
      Booking.find({ user: userId }).populate('venue', 'name').sort({ createdAt: -1 }).limit(3),
      Event.find({ registeredUsers: userId }).sort({ createdAt: -1 }).limit(3),
      Post.find({ author: userId }).sort({ createdAt: -1 }).limit(3),
      Message.find({ senderId: userId }).sort({ createdAt: -1 }).limit(3),
      Comment.find({ author: userId }).populate('post', 'caption').sort({ createdAt: -1 }).limit(3),
      GameComment.find({ authorId: userId }).populate('gameId', 'title').sort({ createdAt: -1 }).limit(3),
    ]);

  const items = [
    ...joinedGames.map((entry) => ({
      type: 'game_joined',
      title: `Joined ${entry.gameId?.title || 'a game'}`,
      subtitle: entry.gameId?.sport || 'Game',
      occurredAt: entry.createdAt,
    })),
    ...hostedGames.map((entry) => ({
      type: 'game_hosted',
      title: `Hosted ${entry.title}`,
      subtitle: entry.sport,
      occurredAt: entry.createdAt,
    })),
    ...bookings.map((entry) => ({
      type: 'booking',
      title: `Booked ${entry.venue?.name || 'a venue'}`,
      subtitle: entry.bookingType,
      occurredAt: entry.createdAt,
    })),
    ...events.map((entry) => ({
      type: 'event',
      title: `Registered for ${entry.title}`,
      subtitle: entry.sport,
      occurredAt: entry.updatedAt || entry.createdAt,
    })),
    ...posts.map((entry) => ({
      type: 'post',
      title: 'Published a social post',
      subtitle: entry.caption || entry.sport || 'ArenaX feed',
      occurredAt: entry.createdAt,
    })),
    ...messages.map((entry) => ({
      type: 'message',
      title: 'Sent a message',
      subtitle: entry.type,
      occurredAt: entry.createdAt,
    })),
    ...postComments.map((entry) => ({
      type: 'post_comment',
      title: 'Commented on a feed post',
      subtitle: entry.post?.caption || 'Social feed',
      occurredAt: entry.createdAt,
    })),
    ...gameComments.map((entry) => ({
      type: 'game_comment',
      title: 'Commented on a game',
      subtitle: entry.gameId?.title || 'ArenaX game',
      occurredAt: entry.createdAt,
    })),
  ];

  return items
    .sort((left, right) => new Date(right.occurredAt) - new Date(left.occurredAt))
    .slice(0, 8);
};

const buildStats = async (userId) => {
  const [
    gamesJoined,
    gamesHosted,
    slotBookings,
    eventsParticipated,
    socialPosts,
    messagesSent,
    followers,
    following,
  ] = await Promise.all([
    GamePlayer.countDocuments({ userId }),
    Game.countDocuments({ hostId: userId }),
    Booking.countDocuments({ user: userId }),
    Event.countDocuments({ registeredUsers: userId }),
    Post.countDocuments({ author: userId }),
    Message.countDocuments({ senderId: userId }),
    Follow.countDocuments({ followingId: userId }),
    Follow.countDocuments({ followerId: userId }),
  ]);

  return {
    gamesJoined,
    gamesHosted,
    slotBookings,
    eventsParticipated,
    socialPosts,
    messagesSent,
    followers,
    following,
  };
};

const serializeUserProfile = async ({ user, viewerId }) => {
  const safeUser = await ensureUsername(user);
  const [stats, activity, isFollowing] = await Promise.all([
    buildStats(safeUser._id),
    buildRecentActivity(safeUser._id),
    viewerId && String(viewerId) !== String(safeUser._id)
      ? Follow.exists({ followerId: viewerId, followingId: safeUser._id })
      : false,
  ]);

  return {
    id: safeUser._id,
    fullName: safeUser.fullName,
    username: safeUser.username,
    email: safeUser.email,
    phone: safeUser.phone || '',
    city: safeUser.city || '',
    role: safeUser.role,
    sportsInterests:
      safeUser.favoriteSports?.length > 0
        ? safeUser.favoriteSports
        : safeUser.sportType
          ? [safeUser.sportType]
          : [],
    skillLevel: safeUser.skillLevel || 'Intermediate',
    playingPosition: safeUser.playingPosition || 'Utility',
    bio: safeUser.bio || 'No bio added yet.',
    avatarUrl:
      safeUser.avatarUrl || 'https://placehold.co/256x256/0f172a/e2e8f0?text=ArenaX',
    followersCount: stats.followers,
    followingCount: stats.following,
    isFollowing: Boolean(isFollowing),
    memberSince: safeUser.createdAt,
    stats,
    recentActivity: activity,
  };
};

exports.getCurrentUser = async (req, res) => {
  try {
    await ensureGameSeedData();
    const user = await User.findById(req.user.id).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const profile = await serializeUserProfile({ user, viewerId: req.user.id });
    return res.json({ success: true, data: { user: profile } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    await ensureGameSeedData();

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid user id.' });
    }

    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const profile = await serializeUserProfile({ user, viewerId: req.user?.id });
    return res.json({ success: true, data: { user: profile } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCurrentUser = async (req, res) => {
  try {
    const {
      fullName,
      username,
      phone,
      city,
      favoriteSports,
      skillLevel,
      playingPosition,
      bio,
      avatarUrl,
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (username && username !== user.username) {
      const existing = await User.findOne({ username: username.toLowerCase(), _id: { $ne: user._id } });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Username is already taken.' });
      }
      user.username = username.toLowerCase().trim();
    }

    if (fullName) user.fullName = fullName.trim();
    if (typeof phone === 'string') user.phone = phone.trim();
    if (typeof city === 'string') user.city = city.trim();
    if (Array.isArray(favoriteSports)) {
      user.favoriteSports = favoriteSports.filter((sport) => SPORT_OPTIONS.includes(sport));
      if (!user.sportType && user.favoriteSports[0]) {
        user.sportType = user.favoriteSports[0];
      }
    }
    if (skillLevel) user.skillLevel = skillLevel;
    if (typeof playingPosition === 'string') user.playingPosition = playingPosition.trim();
    if (typeof bio === 'string') user.bio = bio.trim();
    if (typeof avatarUrl === 'string') user.avatarUrl = avatarUrl.trim();

    await user.save();

    const profile = await serializeUserProfile({ user, viewerId: req.user.id });
    return res.json({ success: true, data: { user: profile } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleFollowUser = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid user id.' });
    }

    if (req.user.id === req.params.id) {
      return res.status(400).json({ success: false, message: 'You cannot follow yourself.' });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const existing = await Follow.findOne({
      followerId: req.user.id,
      followingId: req.params.id,
    });

    let following;
    if (existing) {
      await existing.deleteOne();
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { following: req.params.id },
        $inc: { followingCount: -1 },
      });
      await User.findByIdAndUpdate(req.params.id, {
        $pull: { followers: req.user.id },
        $inc: { followersCount: -1 },
      });
      following = false;
    } else {
      await Follow.create({
        followerId: req.user.id,
        followingId: req.params.id,
      });
      await User.findByIdAndUpdate(req.user.id, {
        $addToSet: { following: req.params.id },
        $inc: { followingCount: 1 },
      });
      await User.findByIdAndUpdate(req.params.id, {
        $addToSet: { followers: req.user.id },
        $inc: { followersCount: 1 },
      });
      following = true;
    }

    const user = await User.findById(req.params.id).select('-passwordHash');
    const profile = await serializeUserProfile({ user, viewerId: req.user.id });
    return res.json({ success: true, data: { following, user: profile } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
