const mongoose = require('mongoose');
const Club = require('../models/Club');
const Game = require('../models/Game');
const Message = require('../models/Message');
const User = require('../models/User');
const { ensureGameSeedData } = require('./games.controller');

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const mapUserPreview = (user) => ({
  id: user?._id,
  name: user?.fullName || 'ArenaX Player',
  avatarUrl: user?.avatarUrl || '',
  role: user?.role || 'player',
  skillLevel: user?.skillLevel || 'Intermediate',
  playingPosition: user?.playingPosition || 'Utility',
});

exports.getMessages = async (req, res) => {
  try {
    await ensureGameSeedData();

    const memberClubs = await Club.find({ members: req.user?.id }).select('_id');
    const filters = req.user?.id
      ? {
          $or: [
            { senderId: req.user.id },
            { recipientId: req.user.id },
            { clubId: { $in: memberClubs.map((club) => club._id) } },
          ],
        }
      : {};

    const messages = await Message.find(filters)
      .populate('senderId', 'fullName avatarUrl role skillLevel playingPosition')
      .populate('recipientId', 'fullName avatarUrl role skillLevel playingPosition')
      .populate('clubId', 'name avatarUrl sport members')
      .populate('gameId', 'title sport format')
      .sort({ createdAt: -1 });

    const clubs = await Club.find({ members: req.user?.id }).sort({ createdAt: -1 });
    const users = await User.find({ _id: { $ne: req.user?.id }, role: { $in: ['player', 'organizer'] } })
      .select('fullName avatarUrl role skillLevel playingPosition sportType')
      .limit(10);

    return res.json({
      success: true,
      data: {
        inbox: messages.map((message) => ({
          id: message._id,
          type: message.type,
          text: message.text,
          createdAt: message.createdAt,
          sender: mapUserPreview(message.senderId),
          recipient: message.recipientId ? mapUserPreview(message.recipientId) : null,
          club: message.clubId
            ? {
                id: message.clubId._id,
                name: message.clubId.name,
                avatarUrl: message.clubId.avatarUrl,
                sport: message.clubId.sport,
                memberCount: message.clubId.members.length,
              }
            : null,
          game: message.gameId
            ? {
                id: message.gameId._id,
                title: message.gameId.title,
                sport: message.gameId.sport,
                format: message.gameId.format,
              }
            : null,
          inviteMeta: message.inviteMeta || null,
        })),
        contacts: users.map(mapUserPreview),
        clubs: clubs.map((club) => ({
          id: club._id,
          name: club.name,
          avatarUrl: club.avatarUrl,
          sport: club.sport,
          memberCount: club.members.length,
        })),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { recipientId = null, clubId = null, gameId = null, text, type = 'direct' } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ success: false, message: 'Message text is required.' });
    }

    if (recipientId && !isValidObjectId(recipientId)) {
      return res.status(400).json({ success: false, message: 'Invalid recipient id.' });
    }

    if (clubId && !isValidObjectId(clubId)) {
      return res.status(400).json({ success: false, message: 'Invalid club id.' });
    }

    if (gameId && !isValidObjectId(gameId)) {
      return res.status(400).json({ success: false, message: 'Invalid game id.' });
    }

    const [recipient, club, game] = await Promise.all([
      recipientId ? User.findById(recipientId) : null,
      clubId ? Club.findById(clubId) : null,
      gameId ? Game.findById(gameId) : null,
    ]);

    if (recipientId && !recipient) {
      return res.status(404).json({ success: false, message: 'Recipient not found.' });
    }
    if (clubId && !club) {
      return res.status(404).json({ success: false, message: 'Club not found.' });
    }
    if (gameId && !game) {
      return res.status(404).json({ success: false, message: 'Game not found.' });
    }

    const message = await Message.create({
      senderId: req.user.id,
      recipientId,
      clubId,
      gameId,
      type,
      text: text.trim(),
      inviteMeta:
        type === 'invite'
          ? {
              gameId,
              status: 'pending',
            }
          : undefined,
    });

    const populated = await Message.findById(message._id)
      .populate('senderId', 'fullName avatarUrl role skillLevel playingPosition')
      .populate('recipientId', 'fullName avatarUrl role skillLevel playingPosition')
      .populate('clubId', 'name avatarUrl sport members')
      .populate('gameId', 'title sport format');

    if (req.io) {
      req.io.emit('messages:updated', {
        messageId: message._id,
        type: message.type,
      });
    }

    return res.status(201).json({
      success: true,
      data: {
        message: {
          id: populated._id,
          type: populated.type,
          text: populated.text,
          createdAt: populated.createdAt,
          sender: mapUserPreview(populated.senderId),
          recipient: populated.recipientId ? mapUserPreview(populated.recipientId) : null,
          club: populated.clubId
            ? {
                id: populated.clubId._id,
                name: populated.clubId.name,
                avatarUrl: populated.clubId.avatarUrl,
                sport: populated.clubId.sport,
                memberCount: populated.clubId.members.length,
              }
            : null,
          game: populated.gameId
            ? {
                id: populated.gameId._id,
                title: populated.gameId.title,
                sport: populated.gameId.sport,
                format: populated.gameId.format,
              }
            : null,
          inviteMeta: populated.inviteMeta || null,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createClub = async (req, res) => {
  try {
    const { name, description = '', sport, memberIds = [] } = req.body;
    const normalizedMemberIds = memberIds.filter((value) => isValidObjectId(value));

    const club = await Club.create({
      name,
      description,
      sport,
      ownerId: req.user.id,
      members: [req.user.id, ...normalizedMemberIds],
    });

    await User.updateMany(
      { _id: { $in: club.members } },
      { $addToSet: { clubs: club._id } },
    );

    if (req.io) {
      req.io.emit('clubs:updated', { clubId: club._id });
    }

    return res.status(201).json({
      success: true,
      data: {
        club: {
          id: club._id,
          name: club.name,
          description: club.description,
          sport: club.sport,
          memberCount: club.members.length,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
