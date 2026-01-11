const EventEmitter = require('events');
const Booking = require('../models/Booking');

class QueueService extends EventEmitter {}

const queueService = new QueueService();

// Background Task 1: Booking Confirmation
queueService.on('booking_confirmed', async ({ email, eventTitle, bookingId }) => {
  // Simulate processing time
  setTimeout(() => {
    console.log(`\n[BACKGROUND TASK] 📧 Sending Booking Confirmation Email...`);
    console.log(`To: ${email}`);
    console.log(`Subject: Booking Confirmed for ${eventTitle}`);
    console.log(`Body: Your booking (ID: ${bookingId}) has been successfully confirmed. Enjoy the event!\n`);
  }, 1000); // 1 second delay
});

// Background Task 2: Event Update Notification
queueService.on('event_updated', async ({ eventId, eventTitle, changes }) => {
  console.log(`\n[BACKGROUND TASK] 🔔 Processing Event Update Notification for: "${eventTitle}"...`);
  
  try {
    // Find all bookings for this event
    const bookings = await Booking.find({ event: eventId }).populate('customer', 'email');
    
    if (bookings.length === 0) {
        console.log(`[Notification Service] No bookings found for event "${eventTitle}". No notifications sent.`);
        return;
    }

    const uniqueEmails = [...new Set(bookings.map(b => b.customer.email))];

    // Simulate sending notifications
    uniqueEmails.forEach(email => {
        setTimeout(() => {
            console.log(`[Notification Service] 📨 To: ${email} | Message: Event "${eventTitle}" details have been updated.`);
        }, 500); 
    });

  } catch (error) {
    console.error(`[BACKGROUND TASK ERROR] Failed to send update notifications: ${error.message}`);
  }
});

module.exports = queueService;
