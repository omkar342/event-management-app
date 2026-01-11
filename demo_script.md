# Demo Video Script (3-4 Minutes)

**Goal**: Show your face, explain the project clearly, demonstrate the features, and mention design decisions.

---

### **Intro (0:00 - 0:30)**
*   **Face Camera**: "Hi, I'm Omkar. This is my submission for the Event Booking System backend assignment."
*   **Screen**: Show typical VS Code view with `README.md` open.
*   **Speak**: "I built this using the MERN stack—Node.js, Express, and MongoDB. I used Docker to spin up a local MongoDB instance for persistence. The system handles authentication, role-based access for Organizers and Customers, and simulates background jobs for notifications."

### **Code Walkthrough (0:30 - 1:30)**
*   **Screen**: Open `src/routes`.
*   **Speak**: "Let's look at the API structure. I organized routes cleanly separating Auth, Events, and Bookings."
*   **Screen**: Open `src/middleware/authMiddleware.js`.
*   **Speak**: "For security, I implemented JWT authentication. The `protect` middleware verifies the token, and `authorize` strictly enforces roles—so a Customer can never accidentally access Organizer features."
*   **Screen**: Open `src/services/queueService.js`.
*   **Speak**: "For background tasks, I used Node's Event Emitter pattern. This decouples the heavy lifting—like sending emails—from the main API response, ensuring the user gets a fast response while the system processes tasks in the background."

### **Live Demo (1:30 - 3:30)**
*   **Action**: Switch to **Postman** (or Terminal with Split Screen showing Server Logs).

1.  **Register/Login**:
    *   "First, I'll log in as an **Organizer**." (Send Request -> Show Token).
    *   "And here is my **Customer** account." (Send Request -> Show Token).

2.  **Create Event**:
    *   "As an Organizer, I'll create a 'Tech Conference'." (Send Request -> Show `201 Created`).

3.  **Booking Flow**:
    *   "Now, switching to the **Customer**. I'll book a ticket for this event."
    *   (Send Request).
    *   **CRITICAL**: Point to the VS Code Terminal logs.
    *   "Notice here in the logs—the API responded instantly, but the **Background Service** picked up the task and simulated sending a 'Booking Confirmation Email' asynchronously."

4.  **Update Notification**:
    *   "Finally, the Organizer updates the event details." (Send PUT Request).
    *   "Checking the logs again... we see the 'Notification Service' alerting all booked customers about the change."

### **Outro (3:30 - 4:00)**
*   **Face Camera**: "To handle data integrity, the system checks ticket availability before every booking to prevent over-selling. All design decisions and setup instructions are documented in the README."
*   "Thank you for watching!"

---
**Tips**:
*   Make sure your server is running (`npm run dev`) and visible so the logs pop up clearly.
*   Have your Postman tabs pre-filled so you don't waste time typing JSON.
