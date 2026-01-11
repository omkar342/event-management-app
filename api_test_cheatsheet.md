# Event Booking App - API Test Cheatsheet

Run these commands in your terminal to test the API.
**Note**: You will need `jq` installed to pretty-print JSON response (optional), otherwise just remove `| jq`.

## 1. Authentication

### Register an Organizer
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "OrganizerOne",
    "email": "org1@example.com",
    "password": "password123",
    "role": "organizer"
  }'
```

### Register a Customer
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "CustomerOne",
    "email": "cust1@example.com",
    "password": "password123",
    "role": "customer"
  }'
```

### Login (Organizer) & Save Token
*Copy the `token` from the response to use in the next steps.*
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "org1@example.com",
    "password": "password123"
  }'
```

### Login (Customer) & Save Token
*Copy the `token` from the response.*
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cust1@example.com",
    "password": "password123"
  }'
```

---

## 2. Event Management (Organizer)

### Create an Event
*Replace `<ORGANIZER_TOKEN>` with the token you got from the Organizer login.*
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ORGANIZER_TOKEN>" \
  -d '{
    "title": "Summer Music Festival",
    "description": "The best summer vibes.",
    "date": "2024-07-15",
    "location": "Central Park",
    "totalTickets": 500,
    "price": 100
  }'
```
*Copy the `_id` of the event from the response for the next steps.*

### Update an Event (Triggers Notification)
*Replace `<EVENT_ID>` and `<ORGANIZER_TOKEN>`.*
```bash
curl -X PUT http://localhost:3000/api/events/<EVENT_ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ORGANIZER_TOKEN>" \
  -d '{
    "title": "Summer Music Festival 2024 (Lineup Announced!)",
    "description": "Updated description with new lineup."
  }'
```

---

## 3. Public Data

### List All Events
```bash
curl -X GET http://localhost:3000/api/events
```

---

## 4. Booking (Customer)

### Book an Event (Triggers Confirmation)
*Replace `<EVENT_ID>` and `<CUSTOMER_TOKEN>`.*
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>" \
  -d '{
    "eventId": "<EVENT_ID>"
  }'
```

### Get My Bookings
```bash
curl -X GET http://localhost:3000/api/bookings \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>"
```
