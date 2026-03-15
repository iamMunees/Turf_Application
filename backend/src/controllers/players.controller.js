const mongoose = require('mongoose');
const Event = require('../models/Event');
const Follow = require('../models/Follow');
const Invite = require('../models/Invite');
const Post = require('../models/Post');
const TrainingBooking = require('../models/TrainingBooking');
const User = require('../models/User');
const { emitNotification } = require('../utils/notifications');
const {
  formatPlayerResponse,
  isWithin24Hours,
  sanitizeText,
  startOfToday,
} = require('../utils/players');

const ensurePlayerObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const buildPlayerFilters = (query, currentUserId) => {
  const filters = { role: 'player' };

  if (query.city) {
    filters.city = query.city;
  }
  if (query.sport) {
    filters.sportType = query.sport;
  }
  if (query.playerType) {
    filters.playerType = query.playerType;
  }
  if (query.level) {
    filters.level = query.level;
  }
  if (query.verified === 'true') {
    filters.isVerified = true;
  }
  if (query.risingStar === 'true') {
    filters.isRisingStar = true;
  }
  if (query.search) {
    filters.$or = [
      { fullName: new RegExp(query.search, 'i') },
      { sportType: new RegExp(query.search, 'i') },
      { city: new RegExp(query.search, 'i') },
    ];
  }
  if (currentUserId) {
    filters.blockedUsers = { $ne: currentUserId };
  }

  return filters;
};

const applySort = (players, sortBy) => {
  if (sortBy === 'Most Followers') {
    return players.sort((left, right) => right.followersCount - left.followersCount);
  }
  if (sortBy === 'Highest Rated') {
    return players.sort((left, right) => right.rating - left.rating);
  }
  if (sortBy === 'Newest') {
    return players.sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
  }
  return players;
};

const hydratePlayerFlags = async (player) => {
  const [eventsRegistered, careerBoostPosts] = await Promise.all([
    Event.countDocuments({ registeredUsers: player._id }),
    Post.countDocuments({
      author: player._id,
      $expr: {
        $or: [{ $gte: [{ $size: '$likes' }, 100] }, { $gte: ['$sharesCount', 10] }],
      },
    }),
  ]);

  const updates = {
    isVerified: eventsRegistered >= 5,
    isRisingStar: careerBoostPosts >= 3,
    followersCount: Array.isArray(player.followers) ? player.followers.length : player.followersCount,
  };

  let shouldUpdate = false;
  Object.entries(updates).forEach(([key, value]) => {
    if (player[key] !== value) {
      player[key] = value;
      shouldUpdate = true;
    }
  });

  if (shouldUpdate) {
    await player.save();
  }

  return {
    player,
    stats: {
      total_posts: await Post.countDocuments({ author: player._id }),
      events_registered: eventsRegistered,
      career_boost_posts: careerBoostPosts,
    },
  };
};

const serializeUserPreview = (user) => ({
  id: user._id,
  name: user.fullName,
  sport: user.sportType,
  city: user.city,
  avatar_url: user.avatarUrl,
});

exports.getPlayers = async (req, res) => {
  try {
    const currentUserId = req.user?.id;
    const filters = buildPlayerFilters(req.query, currentUserId);
    const players = await User.find(filters).select('-passwordHash');

    const hydratedPlayers = await Promise.all(
      players.map(async (player) => {
        const { player: hydrated, stats } = await hydratePlayerFlags(player);
        const isFollowing = currentUserId
          ? await Follow.exists({ followerId: currentUserId, followingId: hydrated._id })
          : false;

        return formatPlayerResponse({
          player: hydrated,
          stats,
          following: Boolean(isFollowing),
        });
      })
    );

    return res.json({
      success: true,
      data: {
        players: applySort(hydratedPlayers, req.query.sortBy),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPlayerProfile = async (req, res) => {
  try {
    if (!ensurePlayerObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid player id.' });
    }

    const player = await User.findOne({ _id: req.params.id, role: 'player' }).select('-passwordHash');
    if (!player) {
      return res.status(404).json({ success: false, message: 'Player not found.' });
    }

    const { player: hydratedPlayer, stats } = await hydratePlayerFlags(player);
    const following = req.user?.id
      ? await Follow.exists({ followerId: req.user.id, followingId: hydratedPlayer._id })
      : false;
    const careerBoostPosts = await Post.find({ author: hydratedPlayer._id })
      .sort({ createdAt: -1 })
      .limit(3);

    return res.json({
      success: true,
      data: {
        player: formatPlayerResponse({
          player: hydratedPlayer,
          stats,
          following: Boolean(following),
        }),
        stats,
        career_boost_posts: careerBoostPosts.map((post) => ({
          id: post._id,
          caption: post.caption,
          likes: post.likes.length,
          shares: post.sharesCount,
          created_at: post.createdAt,
        })),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleFollowPlayer = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.id;

    if (followerId === followingId) {
      return res.status(400).json({ success: false, message: 'You cannot follow yourself.' });
    }

    const player = await User.findOne({ _id: followingId, role: 'player' });
    if (!player) {
      return res.status(404).json({ success: false, message: 'Player not found.' });
    }

    const existingFollow = await Follow.findOne({ followerId, followingId });
    let following;

    if (existingFollow) {
      await existingFollow.deleteOne();
      await User.findByIdAndUpdate(followerId, {
        $pull: { following: followingId },
        $inc: { followingCount: -1 },
      });
      await User.findByIdAndUpdate(followingId, {
        $pull: { followers: followerId },
        $inc: { followersCount: -1 },
      });
      following = false;
    } else {
      await Follow.create({ followerId, followingId });
      await User.findByIdAndUpdate(followerId, {
        $addToSet: { following: followingId },
        $inc: { followingCount: 1 },
      });
      await User.findByIdAndUpdate(followingId, {
        $addToSet: { followers: followerId },
        $inc: { followersCount: 1 },
      });
      emitNotification({
        io: req.io,
        type: 'player:new-follower',
        recipientId: followingId,
        payload: { followerId },
      });
      following = true;
    }

    const updatedPlayer = await User.findById(followingId).select('-passwordHash');
    const { player: hydratedPlayer, stats } = await hydratePlayerFlags(updatedPlayer);

    return res.json({
      success: true,
      data: {
        player: formatPlayerResponse({
          player: hydratedPlayer,
          stats,
          following,
        }),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const follows = await Follow.find({ followingId: req.params.id })
      .populate('followerId', 'fullName city sportType avatarUrl')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: {
        followers: follows.map((follow) => serializeUserPreview(follow.followerId)),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const follows = await Follow.find({ followerId: req.params.id })
      .populate('followingId', 'fullName city sportType avatarUrl')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: {
        following: follows.map((follow) => serializeUserPreview(follow.followingId)),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendInvite = async (req, res) => {
  try {
    const organizerId = req.user.id;
    const playerId = req.params.id;
    const { eventId, message = '' } = req.body;

    const today = startOfToday();
    const invitesToday = await Invite.countDocuments({
      organizerId,
      createdAt: { $gte: today },
    });

    if (invitesToday >= 5) {
      return res.status(429).json({ success: false, message: 'Daily invite limit reached.' });
    }

    const [player, event, organizer] = await Promise.all([
      User.findOne({ _id: playerId, role: 'player' }),
      Event.findById(eventId),
      User.findById(organizerId),
    ]);

    if (!player || !event) {
      return res.status(404).json({ success: false, message: 'Player or event not found.' });
    }

    if (String(event.organizer) !== organizerId && organizer?.role !== 'organizer') {
      return res.status(403).json({ success: false, message: 'Only organizers can send invites for this event.' });
    }

    const invite = await Invite.create({
      eventId,
      playerId,
      organizerId,
      message: sanitizeText(message),
      status: 'Pending',
    });

    emitNotification({
      io: req.io,
      type: 'player:event-invite',
      recipientId: playerId,
      payload: { inviteId: invite._id, eventId },
    });

    return res.status(201).json({
      success: true,
      data: {
        invite: {
          id: invite._id,
          event_id: invite.eventId,
          player_id: invite.playerId,
          organizer_id: invite.organizerId,
          message: invite.message,
          status: invite.status,
          created_at: invite.createdAt,
          updated_at: invite.updatedAt,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.bookTraining = async (req, res) => {
  try {
    const userId = req.user.id;
    const playerId = req.params.id;
    const { date, time, notes = '' } = req.body;

    const bookingsToday = await TrainingBooking.countDocuments({
      userId,
      createdAt: { $gte: startOfToday() },
    });

    if (bookingsToday >= 5) {
      return res.status(429).json({ success: false, message: 'Daily booking limit reached.' });
    }

    const player = await User.findOne({ _id: playerId, role: 'player' });
    if (!player || !player.trainingOffered) {
      return res.status(404).json({ success: false, message: 'Training is not offered by this player.' });
    }

    const conflictingBooking = await TrainingBooking.findOne({
      playerId,
      date,
      time,
      status: { $in: ['Pending', 'Confirmed'] },
    });

    if (conflictingBooking) {
      return res.status(409).json({ success: false, message: 'This training slot is already booked.' });
    }

    const booking = await TrainingBooking.create({
      playerId,
      userId,
      date,
      time,
      notes: sanitizeText(notes),
      status: 'Confirmed',
    });

    emitNotification({
      io: req.io,
      type: 'player:training-booked',
      recipientId: playerId,
      payload: { bookingId: booking._id, userId },
    });

    return res.status(201).json({
      success: true,
      data: {
        booking: {
          id: booking._id,
          player_id: booking.playerId,
          user_id: booking.userId,
          date: booking.date,
          time: booking.time,
          notes: booking.notes,
          status: booking.status,
          created_at: booking.createdAt,
          updated_at: booking.updatedAt,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPlayerBookings = async (req, res) => {
  try {
    const bookings = await TrainingBooking.find({ playerId: req.params.id })
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: {
        bookings: bookings.map((booking) => ({
          id: booking._id,
          player_id: booking.playerId,
          user_id: booking.userId?._id,
          user_name: booking.userId?.fullName,
          user_email: booking.userId?.email,
          date: booking.date,
          time: booking.time,
          notes: booking.notes,
          status: booking.status,
          created_at: booking.createdAt,
          updated_at: booking.updatedAt,
        })),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await TrainingBooking.findOne({
      _id: req.params.bookingId,
      playerId: req.params.id,
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (isWithin24Hours({ date: booking.date, time: booking.time })) {
      return res.status(400).json({
        success: false,
        message: 'Bookings can only be cancelled at least 24 hours before the session.',
      });
    }

    booking.status = 'Cancelled';
    await booking.save();

    emitNotification({
      io: req.io,
      type: 'player:training-cancelled',
      recipientId: booking.playerId,
      payload: { bookingId: booking._id, userId: booking.userId },
    });

    return res.json({
      success: true,
      data: {
        booking: {
          id: booking._id,
          status: booking.status,
          updated_at: booking.updatedAt,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
