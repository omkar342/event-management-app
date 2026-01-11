const express = require('express');
const router = express.Router();
const { getEvents, getEventById, createEvent, updateEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
  .get(getEvents)
  .post(protect, authorize('organizer'), createEvent);

router.route('/:id')
  .get(getEventById)
  .put(protect, authorize('organizer'), updateEvent);

module.exports = router;
