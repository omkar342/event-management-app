const Event = require('../models/Event');
const queueService = require('../services/queueService');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Organizer
const createEvent = async (req, res) => {
  const { title, description, date, location, totalTickets, price } = req.body;

  if (!title || !description || !date || !location || !totalTickets || !price) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  try {
    const event = await Event.create({
      title,
      description,
      date,
      location,
      totalTickets,
      availableTickets: totalTickets,
      price,
      organizer: req.user.id,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Organizer
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Make sure user is event owner
    if (event.organizer.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to update this event' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Trigger Background Task: Event Update Notification
    queueService.emit('event_updated', {
        eventId: updatedEvent._id,
        eventTitle: updatedEvent.title,
        changes: req.body
    });

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
};
