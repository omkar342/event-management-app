const Booking = require('../models/Booking');
const Event = require('../models/Event');
const queueService = require('../services/queueService');
const mongoose = require('mongoose');

// @desc    Book an event
// @route   POST /api/bookings
// @access  Private/Customer
const createBooking = async (req, res) => {
  const { eventId } = req.body;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.availableTickets <= 0) {
      return res.status(400).json({ message: 'Event is sold out' });
    }

    // Check if user already booked this event
    const existingBooking = await Booking.findOne({ customer: req.user.id, event: eventId });
    if (existingBooking) {
        return res.status(400).json({ message: 'You have already booked this event' });
    }

    // Create booking
    const booking = await Booking.create({
      customer: req.user.id,
      event: eventId,
    });

    // Decrement available tickets
    event.availableTickets -= 1;
    await event.save();

    // Trigger Background Task: Booking Confirmation
    queueService.emit('booking_confirmed', {
        email: req.user.email,
        eventTitle: event.title,
        bookingId: booking._id
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my bookings
// @route   GET /api/bookings
// @access  Private/Customer
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ customer: req.user.id }).populate('event');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
  createBooking,
  getMyBookings
};
