const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Review = require('../models/Review');
const Slot = require('../models/Slot');
const User = require('../models/User');
const Venue = require('../models/Venue');

const SPORTS = ['Football', 'Cricket', 'Badminton', 'Pickleball'];
let ensureSeedDataPromise = null;

const demoUsers = [
  {
    fullName: 'ArenaX Demo Player',
    username: 'arenaxplayer',
    email: 'player@arenax.demo',
    role: 'player',
    city: 'Bengaluru',
    favoriteSports: ['Football', 'Badminton'],
    phone: '+91 98765 00001',
    skillLevel: 'Intermediate',
    playingPosition: 'MID',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
  },
  {
    fullName: 'ArenaX Venue Owner',
    username: 'arenaxowner',
    email: 'owner@arenax.demo',
    role: 'organizer',
    city: 'Bengaluru',
    favoriteSports: ['Football', 'Cricket'],
    phone: '+91 98765 00002',
    skillLevel: 'Advanced',
    playingPosition: 'Organizer',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
];

const demoVenues = [
  {
    name: 'ArenaX HSR Turf',
    city: 'Bengaluru',
    area: 'HSR Layout',
    address: '27th Main Road, Sector 2, HSR Layout',
    sportTypes: ['Football', 'Cricket'],
    slotPrice: 1500,
    maxPlayers: 15,
    slotDurationMinutes: 30,
    rating: 4.7,
    reviewsCount: 2,
    distanceKm: 2.4,
    images: [
      'https://images.unsplash.com/photo-1518604666860-9ed391f76460?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    ],
    facilities: ['Floodlights', 'Parking', 'Drinking Water', 'Washrooms', 'Equipment Rental'],
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
    sportTypes: ['Badminton', 'Pickleball'],
    slotPrice: 1200,
    maxPlayers: 6,
    slotDurationMinutes: 30,
    rating: 4.5,
    reviewsCount: 1,
    distanceKm: 4.1,
    images: [
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80',
    ],
    facilities: ['Indoor Courts', 'Showers', 'Cafe', 'Air Conditioning'],
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
    sportTypes: ['Cricket', 'Football'],
    slotPrice: 1800,
    maxPlayers: 18,
    slotDurationMinutes: 30,
    rating: 4.8,
    reviewsCount: 2,
    distanceKm: 5.7,
    images: [
      'https://images.unsplash.com/photo-1522778526097-ce0a22ceb253?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1486286701208-1d58e9338013?auto=format&fit=crop&w=1200&q=80',
    ],
    facilities: ['LED Scoreboard', 'Coaching Zone', 'Parking', 'Locker Room'],
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

const demoReviews = [
  {
    venueName: 'ArenaX HSR Turf',
    rating: 5,
    comment: 'Turf quality stays consistent and the floodlights are strong even for late games.',
  },
  {
    venueName: 'ArenaX HSR Turf',
    rating: 4,
    comment: 'Easy to reach and good parking, but weekend peak hours fill up fast.',
  },
  {
    venueName: 'ArenaX Bandra Courts',
    rating: 4,
    comment: 'Clean indoor setup with quick check-in. Good for doubles and casual groups.',
  },
  {
    venueName: 'ArenaX Jubilee Box',
    rating: 5,
    comment: 'Large playing area and good staff support for team bookings.',
  },
  {
    venueName: 'ArenaX Jubilee Box',
    rating: 5,
    comment: 'One of the better cricket boxes in the area for mixed-size groups.',
  },
];

const formatTimeLabel = (startMinutes, slotDurationMinutes) => {
  const pad = (value) => String(value).padStart(2, '0');

  const formatPart = (minutes) => {
    const hours = Math.floor(minutes / 60) % 24;
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const normalizedHour = hours % 12 || 12;

    return `${normalizedHour}:${pad(mins)} ${period}`;
  };

  return `${formatPart(startMinutes)} - ${formatPart(startMinutes + slotDurationMinutes)}`;
};

const getNormalizedDate = (dateString) => {
  if (!dateString) {
    return new Date().toISOString().slice(0, 10);
  }

  return dateString;
};

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

const ensureSeedData = async () => {
  if (!ensureSeedDataPromise) {
    ensureSeedDataPromise = (async () => {
      const venueCount = await Venue.countDocuments();
      const passwordHash = await bcrypt.hash('arenax-demo', 10);
      const users = [];

      for (const userInput of demoUsers) {
        let user = await User.findOne({ email: userInput.email });

        if (!user) {
          try {
            user = await User.create({
              ...userInput,
              passwordHash,
            });
          } catch (error) {
            if (error?.code === 11000) {
              user = await User.findOne({ email: userInput.email });
            } else {
              throw error;
            }
          }
        }

        users.push(user);
      }

      const owner = users.find((user) => user.role === 'organizer');
      const player = users.find((user) => user.role === 'player');

      if (venueCount > 0) {
        return;
      }

      const venues = [];

      for (const venueInput of demoVenues) {
        let venue = await Venue.findOne({ name: venueInput.name });

        if (!venue) {
          venue = await Venue.create({
            ...venueInput,
            owner: owner._id,
          });
        }

        venues.push(venue);
      }

      for (const reviewInput of demoReviews) {
        const venue = venues.find((item) => item.name === reviewInput.venueName);

        if (!venue) {
          continue;
        }

        const existingReview = await Review.findOne({
          venue: venue._id,
          user: player._id,
          comment: reviewInput.comment,
        });

        if (existingReview) {
          continue;
        }

        await Review.create({
          venue: venue._id,
          user: player._id,
          rating: reviewInput.rating,
          comment: reviewInput.comment,
        });
      }
    })().finally(() => {
      ensureSeedDataPromise = null;
    });
  }

  return ensureSeedDataPromise;
};

const ensureVenueSlots = async (venue, slotDate) => {
  const existingCount = await Slot.countDocuments({
    venue: venue._id,
    slotDate,
  });

  if (existingCount >= 48) {
    return;
  }

  const operations = [];

  for (let startMinutes = 0; startMinutes < 24 * 60; startMinutes += venue.slotDurationMinutes) {
    operations.push({
      updateOne: {
        filter: {
          venue: venue._id,
          slotDate,
          startMinutes,
        },
        update: {
          $setOnInsert: {
            venue: venue._id,
            slotDate,
            startMinutes,
            endMinutes: startMinutes + venue.slotDurationMinutes,
            timeLabel: formatTimeLabel(startMinutes, venue.slotDurationMinutes),
            slotPrice: venue.slotPrice,
            maxPlayers: venue.maxPlayers,
            slotDurationMinutes: venue.slotDurationMinutes,
            bookedPlayers: 0,
            isFullSlotBooked: false,
            status: 'open',
          },
        },
        upsert: true,
      },
    });
  }

  await Slot.bulkWrite(operations);
};

const mapVenueCard = (venue) => ({
  id: venue._id,
  name: venue.name,
  city: venue.city,
  area: venue.area,
  address: venue.address,
  sportTypes: venue.sportTypes,
  slotPrice: venue.slotPrice,
  maxPlayers: venue.maxPlayers,
  slotDurationMinutes: venue.slotDurationMinutes,
  rating: venue.rating,
  distanceKm: venue.distanceKm,
  images: venue.images,
  facilities: venue.facilities,
  contact: venue.contact,
  coordinates: venue.coordinates,
  reviewsCount: venue.reviewsCount,
  pricePerPlayer: Number((venue.slotPrice / venue.maxPlayers).toFixed(2)),
});

exports.bootstrap = async (req, res) => {
  try {
    await ensureSeedData();

    const user = await User.findOne({ email: 'player@arenax.demo' });

    return res.json({
      success: true,
      token: signDemoToken(user),
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username || user.email.split('@')[0].toLowerCase(),
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        city: user.city,
        favoriteSports: user.favoriteSports || [],
        skillLevel: user.skillLevel || 'Intermediate',
        playingPosition: user.playingPosition || 'Utility',
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || '',
      },
      demoCredentials: {
        email: 'player@arenax.demo',
        password: 'arenax-demo',
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getVenueFilters = async (req, res) => {
  try {
    await ensureSeedData();

    const venues = await Venue.find().select('city area sportTypes');
    const cityMap = new Map();

    for (const venue of venues) {
      if (!cityMap.has(venue.city)) {
        cityMap.set(venue.city, new Set());
      }

      cityMap.get(venue.city).add(venue.area);
    }

    return res.json({
      success: true,
      sports: SPORTS,
      cities: Array.from(cityMap.entries()).map(([city, areas]) => ({
        city,
        areas: Array.from(areas).sort(),
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.listVenues = async (req, res) => {
  try {
    await ensureSeedData();

    const { city, area, sport } = req.query;
    const query = {};

    if (city) {
      query.city = city;
    }

    if (area) {
      query.area = area;
    }

    if (sport) {
      query.sportTypes = sport;
    }

    const venues = await Venue.find(query).sort({ rating: -1, distanceKm: 1 });

    return res.json({
      success: true,
      venues: venues.map(mapVenueCard),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getVenueById = async (req, res) => {
  try {
    await ensureSeedData();

    const venue = await Venue.findById(req.params.venueId).populate('owner', 'fullName email city');

    if (!venue) {
      return res.status(404).json({ success: false, message: 'Venue not found.' });
    }

    const reviews = await Review.find({ venue: venue._id })
      .populate('user', 'fullName')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      venue: {
        ...mapVenueCard(venue),
        owner: venue.owner,
        reviews: reviews.map((review) => ({
          id: review._id,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
          user: review.user
            ? {
                id: review.user._id,
                fullName: review.user.fullName,
              }
            : null,
        })),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getVenueSlots = async (req, res) => {
  try {
    await ensureSeedData();

    const slotDate = getNormalizedDate(req.query.date);
    const venue = await Venue.findById(req.params.venueId);

    if (!venue) {
      return res.status(404).json({ success: false, message: 'Venue not found.' });
    }

    await ensureVenueSlots(venue, slotDate);

    const slots = await Slot.find({ venue: venue._id, slotDate }).sort({ startMinutes: 1 });

    return res.json({
      success: true,
      venue: mapVenueCard(venue),
      slotDate,
      slots: slots.map((slot) => ({
        id: slot._id,
        timeLabel: slot.timeLabel,
        slotDate: slot.slotDate,
        slotDurationMinutes: slot.slotDurationMinutes,
        slotPrice: slot.slotPrice,
        maxPlayers: slot.maxPlayers,
        bookedPlayers: slot.bookedPlayers,
        remainingPlayers: slot.maxPlayers - slot.bookedPlayers,
        isFullSlotBooked: slot.isFullSlotBooked,
        status: slot.status,
        pricePerPlayer: Number((slot.slotPrice / slot.maxPlayers).toFixed(2)),
        canBookFullSlot: !slot.isFullSlotBooked && slot.bookedPlayers === 0,
        canJoin: !slot.isFullSlotBooked && slot.bookedPlayers < slot.maxPlayers,
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const venue = await Venue.findById(req.params.venueId);

    if (!venue) {
      return res.status(404).json({ success: false, message: 'Venue not found.' });
    }

    const review = await Review.create({
      venue: venue._id,
      user: req.user.id,
      rating,
      comment,
    });

    const stats = await Review.aggregate([
      { $match: { venue: venue._id } },
      {
        $group: {
          _id: '$venue',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const [summary] = stats;

    if (summary) {
      venue.rating = Number(summary.averageRating.toFixed(1));
      venue.reviewsCount = summary.totalReviews;
      await venue.save();
    }

    const populatedReview = await Review.findById(review._id).populate('user', 'fullName');

    return res.status(201).json({
      success: true,
      review: {
        id: populatedReview._id,
        rating: populatedReview.rating,
        comment: populatedReview.comment,
        createdAt: populatedReview.createdAt,
        user: populatedReview.user
          ? {
              id: populatedReview.user._id,
              fullName: populatedReview.user.fullName,
            }
          : null,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
