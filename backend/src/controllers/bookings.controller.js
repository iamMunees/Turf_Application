const Booking = require('../models/Booking');
const Product = require('../models/Product');
const Slot = require('../models/Slot');
const Venue = require('../models/Venue');
const {
  buildRecommendationContext,
  buildRecommendationScore,
  ensureProductsSeeded,
  getCartEntries,
  serializeCart,
} = require('../utils/addons');

const buildBookingResponse = async (bookingId) =>
  Booking.findById(bookingId)
    .populate('user', 'fullName email city')
    .populate('venue')
    .populate('slot');

exports.getAvailability = async (req, res) => {
  try {
    const { venueId, date } = req.query;

    if (!venueId || !date) {
      return res.status(400).json({
        success: false,
        message: 'venueId and date are required.',
      });
    }

    const slots = await Slot.find({ venue: venueId, slotDate: date }).sort({ startMinutes: 1 });

    return res.json({
      success: true,
      slots: slots.map((slot) => ({
        id: slot._id,
        timeLabel: slot.timeLabel,
        slotDate: slot.slotDate,
        maxPlayers: slot.maxPlayers,
        bookedPlayers: slot.bookedPlayers,
        remainingPlayers: slot.maxPlayers - slot.bookedPlayers,
        slotPrice: slot.slotPrice,
        pricePerPlayer: Number((slot.slotPrice / slot.maxPlayers).toFixed(2)),
        isFullSlotBooked: slot.isFullSlotBooked,
        canJoin: !slot.isFullSlotBooked && slot.bookedPlayers < slot.maxPlayers,
        canBookFullSlot: !slot.isFullSlotBooked && slot.bookedPlayers === 0,
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { slotId, venueId, bookingType, playerCount = 1 } = req.body;

    if (!slotId || !venueId || !bookingType) {
      return res.status(400).json({
        success: false,
        message: 'slotId, venueId, and bookingType are required.',
      });
    }

    if (!['full', 'individual'].includes(bookingType)) {
      return res.status(400).json({
        success: false,
        message: 'bookingType must be either full or individual.',
      });
    }

    const [slot, venue] = await Promise.all([
      Slot.findById(slotId),
      Venue.findById(venueId),
    ]);

    if (!slot || !venue) {
      return res.status(404).json({ success: false, message: 'Venue or slot not found.' });
    }

    if (String(slot.venue) !== String(venue._id)) {
      return res.status(400).json({ success: false, message: 'Slot does not belong to this venue.' });
    }

    let updatedSlot;
    let bookingPayload;

    if (bookingType === 'full') {
      updatedSlot = await Slot.findOneAndUpdate(
        {
          _id: slot._id,
          isFullSlotBooked: false,
          bookedPlayers: 0,
        },
        [
          {
            $set: {
              bookedPlayers: '$maxPlayers',
              isFullSlotBooked: true,
              status: 'full',
            },
          },
        ],
        { new: true },
      );

      if (!updatedSlot) {
        return res.status(409).json({
          success: false,
          message: 'This slot already has participants. Full-slot booking is no longer available.',
        });
      }

      bookingPayload = {
        user: req.user.id,
        venue: venue._id,
        slot: slot._id,
        bookingType: 'full',
        playersBooked: slot.maxPlayers,
        amountPaid: slot.slotPrice,
        pricePerPlayer: Number((slot.slotPrice / slot.maxPlayers).toFixed(2)),
        currency: 'INR',
      };
    } else {
      const normalizedPlayerCount = Number.parseInt(playerCount, 10);

      if (!Number.isInteger(normalizedPlayerCount) || normalizedPlayerCount < 1) {
        return res.status(400).json({
          success: false,
          message: 'playerCount must be a positive integer for individual bookings.',
        });
      }

      if (normalizedPlayerCount > slot.maxPlayers) {
        return res.status(400).json({
          success: false,
          message: 'playerCount cannot exceed the venue maxPlayers value.',
        });
      }

      updatedSlot = await Slot.findOneAndUpdate(
        {
          _id: slot._id,
          isFullSlotBooked: false,
          bookedPlayers: { $lte: slot.maxPlayers - normalizedPlayerCount },
        },
        [
          {
            $set: {
              bookedPlayers: { $add: ['$bookedPlayers', normalizedPlayerCount] },
              status: {
                $cond: [
                  {
                    $gte: [{ $add: ['$bookedPlayers', normalizedPlayerCount] }, '$maxPlayers'],
                  },
                  'full',
                  'open',
                ],
              },
            },
          },
        ],
        { new: true },
      );

      if (!updatedSlot) {
        return res.status(409).json({
          success: false,
          message: 'Not enough seats remain in this slot.',
        });
      }

      bookingPayload = {
        user: req.user.id,
        venue: venue._id,
        slot: slot._id,
        bookingType: 'individual',
        playersBooked: normalizedPlayerCount,
        amountPaid: Number(((slot.slotPrice / slot.maxPlayers) * normalizedPlayerCount).toFixed(2)),
        pricePerPlayer: Number((slot.slotPrice / slot.maxPlayers).toFixed(2)),
        currency: 'INR',
      };
    }

    let booking;

    try {
      booking = await Booking.create(bookingPayload);
    } catch (error) {
      if (bookingType === 'full') {
        await Slot.findByIdAndUpdate(slot._id, {
          bookedPlayers: 0,
          isFullSlotBooked: false,
          status: 'open',
        });
      } else {
        await Slot.findByIdAndUpdate(slot._id, {
          $inc: { bookedPlayers: -bookingPayload.playersBooked },
          $set: { status: 'open' },
        });
      }

      throw error;
    }

    const hydratedBooking = await buildBookingResponse(booking._id);

    if (req.io) {
      req.io.emit('booking:created', hydratedBooking);
    }

    return res.status(201).json({
      success: true,
      booking: hydratedBooking,
      slot: updatedSlot,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('venue')
      .populate('slot')
      .sort({ createdAt: -1 });

    return res.json({ success: true, bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBookingAddOns = async (req, res) => {
  try {
    await ensureProductsSeeded();

    const booking = await Booking.findById(req.params.bookingId)
      .populate('venue')
      .populate('slot');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (String(booking.user) !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You cannot access add-ons for this booking.' });
    }

    const [products, cartEntries] = await Promise.all([
      Product.find(),
      getCartEntries(req.user.id),
    ]);

    const context = buildRecommendationContext({
      booking: { slot: booking.slot },
      venue: booking.venue,
    });

    const cartProductIds = new Set(cartEntries.map((entry) => String(entry.productId._id)));

    const recommendations = products
      .map((product) => ({
        product,
        score: buildRecommendationScore({
          product,
          context,
          cartEntries,
        }),
      }))
      .sort((left, right) => right.score - left.score)
      .slice(0, 6)
      .map(({ product }) => ({
        id: product._id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: Number(product.price.toFixed(2)),
        image_url: product.imageUrl,
        rating: Number(product.rating.toFixed(1)),
        popularity_score: product.popularityScore,
        tags: [context.sport, context.timeTag, context.city],
        is_added: cartProductIds.has(String(product._id)),
      }));

    return res.json({
      success: true,
      data: {
        booking: {
          id: booking._id,
          venueId: booking.venue?._id,
          venueName: booking.venue?.name,
          city: booking.venue?.city,
          sportType: booking.venue?.sportTypes?.[0] || 'Cricket',
          level: 'Local',
          slotDate: booking.slot?.slotDate,
          timeLabel: booking.slot?.timeLabel,
          durationMinutes: booking.slot?.slotDurationMinutes || 60,
          amountPaid: booking.amountPaid,
          pricePerHour: booking.slot?.slotPrice || booking.amountPaid,
          bookingType: booking.bookingType,
        },
        recommendations,
        cart: serializeCart(cartEntries),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
