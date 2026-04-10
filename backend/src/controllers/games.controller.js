const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Club = require('../models/Club');
const Follow = require('../models/Follow');
const Game = require('../models/Game');
const GameComment = require('../models/GameComment');
const GamePlayer = require('../models/GamePlayer');
const Message = require('../models/Message');
const User = require('../models/User');
const Venue = require('../models/Venue');

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);
let ensureGameSeedDataPromise = null;

const demoUsers = [
  {
    fullName: 'ArenaX Demo Player',
    email: 'player@arenax.demo',
    role: 'player',
    city: 'Bengaluru',
    favoriteSports: ['Football', 'Badminton'],
    sportType: 'Football',
    skillLevel: 'Intermediate',
    playingPosition: 'MID',
    avatarUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
  },
  {
    fullName: 'ArenaX Venue Owner',
    email: 'owner@arenax.demo',
    role: 'organizer',
    city: 'Bengaluru',
    favoriteSports: ['Football', 'Cricket'],
    sportType: 'Football',
    skillLevel: 'Advanced',
    playingPosition: 'Coach',
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
  {
    fullName: 'Rohan Mehta',
    email: 'rohan@arenax.demo',
    role: 'player',
    city: 'Bengaluru',
    favoriteSports: ['Football'],
    sportType: 'Football',
    skillLevel: 'Advanced',
    playingPosition: 'FW',
    avatarUrl:
      'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=400&q=80',
  },
  {
    fullName: 'Ananya Rao',
    email: 'ananya@arenax.demo',
    role: 'player',
    city: 'Mumbai',
    favoriteSports: ['Badminton'],
    sportType: 'Badminton',
    skillLevel: 'Intermediate',
    playingPosition: 'Right Court',
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  },
  {
    fullName: 'Kabir Singh',
    email: 'kabir@arenax.demo',
    role: 'player',
    city: 'Hyderabad',
    favoriteSports: ['Cricket'],
    sportType: 'Cricket',
    skillLevel: 'Beginner',
    playingPosition: 'All Rounder',
    avatarUrl:
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=400&q=80',
  },
];

const demoVenues = [
  {
    name: 'ArenaX HSR Turf',
    city: 'Bengaluru',
    area: 'HSR Layout',
    address: '27th Main Road, Sector 2, HSR Layout',
    sportTypes: ['Football', 'Cricket'],
    slotPrice: 2100,
    maxPlayers: 14,
    slotDurationMinutes: 60,
    rating: 4.7,
    reviewsCount: 2,
    distanceKm: 2.4,
    images: [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    ],
    facilities: ['Floodlights', 'Parking', 'Drinking Water'],
    contact: {
      phone: '+91 98765 43210',
      email: 'hsr@arenax.com',
    },
    coordinates: {
      lat: 12.9116,
      lng: 77.6474,
    },
  },
  {
    name: 'ArenaX Bandra Courts',
    city: 'Mumbai',
    area: 'Bandra West',
    address: 'Linking Road, Bandra West',
    sportTypes: ['Badminton'],
    slotPrice: 1200,
    maxPlayers: 6,
    slotDurationMinutes: 60,
    rating: 4.5,
    reviewsCount: 1,
    distanceKm: 4.1,
    images: [
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80',
    ],
    facilities: ['Indoor Courts', 'Cafe', 'Air Conditioning'],
    contact: {
      phone: '+91 99887 66554',
      email: 'bandra@arenax.com',
    },
    coordinates: {
      lat: 19.0596,
      lng: 72.8295,
    },
  },
  {
    name: 'ArenaX Jubilee Box',
    city: 'Hyderabad',
    area: 'Jubilee Hills',
    address: 'Road No. 36, Jubilee Hills',
    sportTypes: ['Cricket'],
    slotPrice: 2400,
    maxPlayers: 12,
    slotDurationMinutes: 90,
    rating: 4.8,
    reviewsCount: 2,
    distanceKm: 5.7,
    images: [
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
    ],
    facilities: ['LED Scoreboard', 'Parking', 'Locker Room'],
    contact: {
      phone: '+91 91234 56780',
      email: 'jubilee@arenax.com',
    },
    coordinates: {
      lat: 17.4326,
      lng: 78.4071,
    },
  },
];

const serializeUser = (user, following = false) => ({
  id: user?._id,
  name: user?.fullName || 'ArenaX Player',
  avatarUrl: user?.avatarUrl || '',
  city: user?.city || '',
  role: user?.role || 'player',
  sportType: user?.sportType || '',
  skillLevel: user?.skillLevel || 'Intermediate',
  playingPosition: user?.playingPosition || 'Utility',
  following,
});

const signDemoToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET || 'lineup-secret',
    { expiresIn: '7d' },
  );

const shiftDays = (days, hour, minute = 0) => {
  const value = new Date();
  value.setHours(hour, minute, 0, 0);
  value.setDate(value.getDate() + days);
  return value;
};

const formatDisplayTime = (hour, minute = 0) => {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

const ensureDemoUsers = async () => {
  const passwordHash = await bcrypt.hash('arenax-demo', 10);
  const users = [];

  for (const input of demoUsers) {
    let user = await User.findOne({ email: input.email });
    if (!user) {
      try {
        user = await User.create({
          ...input,
          passwordHash,
        });
      } catch (error) {
        if (error?.code === 11000) {
          user = await User.findOne({ email: input.email });
        } else {
          throw error;
        }
      }
    }
    users.push(user);
  }

  return users;
};

const ensureDemoVenues = async (ownerId) => {
  const venues = [];

  for (const input of demoVenues) {
    let venue = await Venue.findOne({ name: input.name });
    if (!venue) {
      try {
        venue = await Venue.create({
          ...input,
          owner: ownerId,
        });
      } catch (error) {
        if (error?.code === 11000) {
          venue = await Venue.findOne({ name: input.name });
        } else {
          throw error;
        }
      }
    }
    venues.push(venue);
  }

  return venues;
};

const mapGameCard = (game, venue) => ({
  id: game._id,
  title: game.title,
  sport: game.sport,
  format: game.format,
  date: game.date,
  startTime: game.startTime,
  endTime: game.endTime,
  maxPlayers: game.maxPlayers,
  currentPlayers: game.currentPlayers,
  pricePerPlayer: game.pricePerPlayer,
  visibility: game.visibility,
  imageUrl: game.imageUrl || venue?.images?.[0] || '',
  distanceKm: game.distanceKm || venue?.distanceKm || 0,
  venue: venue
    ? {
        id: venue._id,
        name: venue.name,
        area: venue.area,
        city: venue.city,
        address: venue.address,
      }
    : null,
});

const formatCommentTree = (comments, followingIds = new Set()) => {
  const nodes = comments.map((comment) => ({
    id: comment._id,
    gameId: comment.gameId,
    parentCommentId: comment.parentCommentId,
    text: comment.text,
    createdAt: comment.createdAt,
    author: serializeUser(comment.authorId, followingIds.has(String(comment.authorId?._id))),
    replies: [],
  }));

  const byId = new Map(nodes.map((comment) => [String(comment.id), comment]));
  const roots = [];

  nodes.forEach((comment) => {
    if (comment.parentCommentId) {
      const parent = byId.get(String(comment.parentCommentId));
      if (parent) {
        parent.replies.push(comment);
        return;
      }
    }
    roots.push(comment);
  });

  return roots;
};

const ensureGameSeedData = async () => {
  if (!ensureGameSeedDataPromise) {
    ensureGameSeedDataPromise = (async () => {
      const users = await ensureDemoUsers();
      const organizer = users.find((user) => user.email === 'owner@arenax.demo');
      const venues = await ensureDemoVenues(organizer._id);
      const player = users.find((user) => user.email === 'player@arenax.demo');
      const rohan = users.find((user) => user.email === 'rohan@arenax.demo');
      const ananya = users.find((user) => user.email === 'ananya@arenax.demo');
      const kabir = users.find((user) => user.email === 'kabir@arenax.demo');

      let club = await Club.findOne({ name: 'ArenaX Early Kickers' });
      if (!club) {
        club = await Club.create({
          name: 'ArenaX Early Kickers',
          description: 'Morning football runners and weekday turf regulars.',
          sport: 'Football',
          avatarUrl:
            'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=400&q=80',
          ownerId: organizer._id,
          members: [organizer._id, player._id, rohan._id],
        });
      }

      await User.updateMany(
        { _id: { $in: [organizer._id, player._id, rohan._id] } },
        { $addToSet: { clubs: club._id } },
      );

      const seededGames = [
        {
          title: 'Football Sunrise Scrimmage',
          sport: 'Football',
          format: '7v7',
          venueId: venues[0]._id,
          hostId: rohan._id,
          date: shiftDays(1, 6, 30),
          startTime: formatDisplayTime(6, 30),
          endTime: formatDisplayTime(7, 30),
          maxPlayers: 14,
          currentPlayers: 3,
          pricePerPlayer: 147,
          visibility: 'public',
          imageUrl: venues[0].images[0],
          distanceKm: venues[0].distanceKm,
          notes: 'Fast-paced half pitch session. Shin guards preferred.',
        },
        {
          title: 'Bandra Smash Doubles',
          sport: 'Badminton',
          format: '2v2',
          venueId: venues[1]._id,
          hostId: ananya._id,
          date: shiftDays(1, 21, 0),
          startTime: formatDisplayTime(21, 0),
          endTime: formatDisplayTime(22, 0),
          maxPlayers: 4,
          currentPlayers: 1,
          pricePerPlayer: 300,
          visibility: 'friends',
          imageUrl: venues[1].images[0],
          distanceKm: venues[1].distanceKm,
          notes: 'Friends-only doubles rotation. Feather shuttles included.',
        },
        {
          title: 'Cricket Box Night Nets',
          sport: 'Cricket',
          format: '6v6',
          venueId: venues[2]._id,
          hostId: kabir._id,
          date: shiftDays(2, 20, 0),
          startTime: formatDisplayTime(20, 0),
          endTime: formatDisplayTime(21, 30),
          maxPlayers: 12,
          currentPlayers: 2,
          pricePerPlayer: 200,
          visibility: 'club',
          imageUrl: venues[2].images[0],
          distanceKm: venues[2].distanceKm,
          inviteMeta: {
            allowInvites: true,
            friendsOnly: false,
            clubId: club._id,
            inviteCode: 'BOXNIGHT',
          },
          notes: 'Club members priority. Mixed batting and bowling nets.',
        },
      ];

      for (const input of seededGames) {
        let game = await Game.findOne({ title: input.title });
        if (!game) {
          game = await Game.create(input);
        }

        const joiners = [];
        if (input.title === 'Football Sunrise Scrimmage') {
          joiners.push(player, rohan, organizer);
        }
        if (input.title === 'Bandra Smash Doubles') {
          joiners.push(ananya);
        }
        if (input.title === 'Cricket Box Night Nets') {
          joiners.push(kabir, organizer);
        }

        for (const joiner of joiners) {
          await GamePlayer.updateOne(
            { gameId: game._id, userId: joiner._id },
            {
              $setOnInsert: {
                gameId: game._id,
                userId: joiner._id,
                amountPaid: game.pricePerPlayer,
                paymentStatus: 'paid',
                paymentReference: `seed-${game._id}-${joiner._id}`,
                skillLevel: joiner.skillLevel,
                playingPosition: joiner.playingPosition,
                isHost: String(joiner._id) === String(game.hostId),
              },
            },
            { upsert: true },
          );
        }
      }

      const existingInvite = await Message.findOne({ type: 'invite' });
      if (!existingInvite) {
        const footballGame = await Game.findOne({ title: 'Football Sunrise Scrimmage' });
        await Message.create({
          senderId: rohan._id,
          recipientId: player._id,
          gameId: footballGame._id,
          type: 'invite',
          text: 'Need one more midfielder for tomorrow. Join if you are in.',
          inviteMeta: {
            gameId: footballGame._id,
            status: 'pending',
          },
        });
      }

      const commentCount = await GameComment.countDocuments();
      if (commentCount === 0) {
        const footballGame = await Game.findOne({ title: 'Football Sunrise Scrimmage' });
        const topComment = await GameComment.create({
          gameId: footballGame._id,
          authorId: rohan._id,
          text: 'Bring dark jerseys. We are splitting into two balanced sides.',
        });

        await GameComment.create({
          gameId: footballGame._id,
          authorId: player._id,
          parentCommentId: topComment._id,
          text: 'I will be there 10 minutes early.',
        });
      }

      return {
        demoUser: player,
        demoToken: signDemoToken(player),
      };
    })().finally(() => {
      ensureGameSeedDataPromise = null;
    });
  }

  return ensureGameSeedDataPromise;
};

exports.bootstrap = async (_req, res) => {
  try {
    const seed = await ensureGameSeedData();
    return res.json({
      success: true,
      token: seed.demoToken,
      user: {
        id: seed.demoUser._id,
        fullName: seed.demoUser.fullName,
        email: seed.demoUser.email,
        role: seed.demoUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getGames = async (req, res) => {
  try {
    await ensureGameSeedData();

    const query = { status: { $in: ['upcoming', 'full'] } };
    if (req.query.sport) {
      query.sport = req.query.sport;
    }

    const games = await Game.find(query)
      .populate('venueId')
      .populate('hostId', 'fullName avatarUrl role skillLevel playingPosition city')
      .sort({ sport: 1, date: 1, startTime: 1 });

    const grouped = games.reduce((accumulator, game) => {
      if (!accumulator[game.sport]) {
        accumulator[game.sport] = [];
      }
      accumulator[game.sport].push({
        ...mapGameCard(game, game.venueId),
        host: serializeUser(game.hostId),
      });
      return accumulator;
    }, {});

    return res.json({
      success: true,
      data: {
        groups: Object.entries(grouped).map(([sport, items]) => ({
          sport,
          items,
        })),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getGameById = async (req, res) => {
  try {
    await ensureGameSeedData();

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid game id.' });
    }

    const game = await Game.findById(req.params.id)
      .populate('venueId')
      .populate('hostId', 'fullName avatarUrl role skillLevel playingPosition city');

    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found.' });
    }

    const [players, comments, followingRows] = await Promise.all([
      GamePlayer.find({ gameId: game._id })
        .populate('userId', 'fullName avatarUrl role skillLevel playingPosition city')
        .sort({ isHost: -1, createdAt: 1 }),
      GameComment.find({ gameId: game._id })
        .populate('authorId', 'fullName avatarUrl role skillLevel playingPosition city')
        .sort({ createdAt: 1 }),
      req.user?.id ? Follow.find({ followerId: req.user.id }).select('followingId') : [],
    ]);

    const followingIds = new Set(followingRows.map((row) => String(row.followingId)));

    return res.json({
      success: true,
      data: {
        game: {
          ...mapGameCard(game, game.venueId),
          notes: game.notes,
          status: game.status,
          inviteMeta: game.inviteMeta,
          venue: game.venueId
            ? {
                id: game.venueId._id,
                name: game.venueId.name,
                area: game.venueId.area,
                city: game.venueId.city,
                address: game.venueId.address,
                imageUrl: game.imageUrl || game.venueId.images?.[0] || '',
                distanceKm: game.distanceKm || game.venueId.distanceKm || 0,
              }
            : null,
          host: serializeUser(game.hostId, followingIds.has(String(game.hostId?._id))),
          players: players.map((player) => ({
            id: player._id,
            joinedAt: player.joinedAt,
            paymentStatus: player.paymentStatus,
            amountPaid: player.amountPaid,
            isHost: player.isHost,
            user: serializeUser(player.userId, followingIds.has(String(player.userId?._id))),
          })),
          comments: formatCommentTree(comments, followingIds),
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getGamePlayers = async (req, res) => {
  try {
    await ensureGameSeedData();

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid game id.' });
    }

    const players = await GamePlayer.find({ gameId: req.params.id })
      .populate('userId', 'fullName avatarUrl role skillLevel playingPosition city')
      .sort({ isHost: -1, createdAt: 1 });

    return res.json({
      success: true,
      data: {
        players: players.map((player) => ({
          id: player._id,
          joinedAt: player.joinedAt,
          paymentStatus: player.paymentStatus,
          amountPaid: player.amountPaid,
          isHost: player.isHost,
          user: serializeUser(player.userId),
        })),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createGame = async (req, res) => {
  try {
    const {
      title,
      sport,
      format,
      venueId,
      date,
      startTime,
      endTime,
      maxPlayers,
      pricePerPlayer,
      visibility = 'public',
      notes = '',
      clubId = null,
    } = req.body;

    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ success: false, message: 'Venue not found.' });
    }

    const game = await Game.create({
      title: title?.trim() || `${sport} Match`,
      sport,
      format,
      venueId,
      hostId: req.user.id,
      date,
      startTime,
      endTime,
      maxPlayers,
      currentPlayers: 1,
      pricePerPlayer,
      visibility,
      notes,
      imageUrl: venue.images?.[0] || '',
      distanceKm: venue.distanceKm || 0,
      inviteMeta: {
        allowInvites: true,
        friendsOnly: visibility === 'friends',
        clubId,
      },
    });

    const host = await User.findById(req.user.id);
    await GamePlayer.create({
      gameId: game._id,
      userId: req.user.id,
      amountPaid: 0,
      paymentStatus: 'paid',
      paymentReference: `host-${game._id}`,
      skillLevel: host?.skillLevel,
      playingPosition: host?.playingPosition,
      isHost: true,
    });

    if (req.io) {
      req.io.emit('games:updated', { gameId: game._id, type: 'created' });
    }

    return res.status(201).json({
      success: true,
      data: {
        game,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.joinGame = async (req, res) => {
  try {
    await ensureGameSeedData();

    const { gameId, paymentMethod = 'upi', paymentReference } = req.body;
    if (!isValidObjectId(gameId)) {
      return res.status(400).json({ success: false, message: 'Invalid game id.' });
    }

    const [game, user] = await Promise.all([
      Game.findById(gameId).populate('venueId').populate('hostId', 'fullName avatarUrl role skillLevel playingPosition city'),
      User.findById(req.user.id),
    ]);

    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found.' });
    }

    const existingPlayer = await GamePlayer.findOne({ gameId, userId: req.user.id });
    if (existingPlayer) {
      return res.status(409).json({ success: false, message: 'You have already joined this game.' });
    }

    const updatedGame = await Game.findOneAndUpdate(
      {
        _id: gameId,
        currentPlayers: { $lt: game.maxPlayers },
        status: { $in: ['upcoming', 'full'] },
      },
      [
        {
          $set: {
            currentPlayers: { $add: ['$currentPlayers', 1] },
            status: {
              $cond: [{ $gte: [{ $add: ['$currentPlayers', 1] }, '$maxPlayers'] }, 'full', 'upcoming'],
            },
          },
        },
      ],
      { new: true },
    );

    if (!updatedGame) {
      return res.status(409).json({ success: false, message: 'Game Full' });
    }

    try {
      await GamePlayer.create({
        gameId,
        userId: req.user.id,
        amountPaid: game.pricePerPlayer,
        paymentStatus: 'paid',
        paymentReference:
          paymentReference || `${paymentMethod}-${Date.now()}-${String(req.user.id).slice(-6)}`,
        skillLevel: user?.skillLevel,
        playingPosition: user?.playingPosition,
        isHost: false,
      });
    } catch (error) {
      await Game.findByIdAndUpdate(gameId, {
        $inc: { currentPlayers: -1 },
        $set: { status: 'upcoming' },
      });
      if (error?.code === 11000) {
        return res.status(409).json({ success: false, message: 'You have already joined this game.' });
      }
      throw error;
    }

    if (req.io) {
      req.io.emit('games:updated', {
        gameId,
        type: 'joined',
        currentPlayers: updatedGame.currentPlayers,
        maxPlayers: updatedGame.maxPlayers,
      });
    }

    return res.json({
      success: true,
      data: {
        payment: {
          status: 'paid',
          method: paymentMethod,
          amount: game.pricePerPlayer,
        },
        game: {
          ...mapGameCard(updatedGame, game.venueId),
          host: serializeUser(game.hostId),
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { gameId, text, parentCommentId = null } = req.body;

    if (!isValidObjectId(gameId)) {
      return res.status(400).json({ success: false, message: 'Invalid game id.' });
    }

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found.' });
    }

    if (parentCommentId && !isValidObjectId(parentCommentId)) {
      return res.status(400).json({ success: false, message: 'Invalid parent comment id.' });
    }

    const comment = await GameComment.create({
      gameId,
      authorId: req.user.id,
      parentCommentId,
      text,
    });

    const populated = await GameComment.findById(comment._id).populate(
      'authorId',
      'fullName avatarUrl role skillLevel playingPosition city',
    );

    if (req.io) {
      req.io.emit('games:commented', {
        gameId,
        commentId: comment._id,
      });
    }

    return res.status(201).json({
      success: true,
      data: {
        comment: {
          id: populated._id,
          gameId: populated.gameId,
          parentCommentId: populated.parentCommentId,
          text: populated.text,
          createdAt: populated.createdAt,
          author: serializeUser(populated.authorId),
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getClubs = async (_req, res) => {
  try {
    await ensureGameSeedData();
    const clubs = await Club.find().populate('ownerId', 'fullName avatarUrl');
    return res.json({
      success: true,
      data: {
        clubs: clubs.map((club) => ({
          id: club._id,
          name: club.name,
          description: club.description,
          sport: club.sport,
          avatarUrl: club.avatarUrl,
          owner: {
            id: club.ownerId?._id,
            name: club.ownerId?.fullName,
            avatarUrl: club.ownerId?.avatarUrl,
          },
          memberCount: club.members.length,
        })),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports.ensureGameSeedData = ensureGameSeedData;
