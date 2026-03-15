const Event = require('../models/Event');

exports.getEvents = async (req, res) => {
  try {
    const filters = {};
    if (req.query.sport) {
      filters.sport = req.query.sport;
    }

    const events = await Event.find(filters).populate('organizer', 'fullName role');
    return res.json({ success: true, events });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId).populate('organizer', 'fullName role');
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    return res.json({ success: true, event });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      organizer: req.user.id,
    });

    if (req.io) {
      req.io.emit('event:created', event);
    }

    return res.status(201).json({ success: true, event });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.eventId,
      {
        $addToSet: {
          registeredUsers: req.user.id,
        },
      },
      { new: true },
    );

    return res.json({ success: true, event });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
