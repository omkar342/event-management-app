# Event Booking System - Backend Assignment

This project is a backend API for an Event Booking System built with the **MERN Stack** (Node.js, Express, MongoDB (Local via Docker)). It supports two user roles (Organizer & Customer) and simulates background tasks for notifications.

## 🚀 Features

*   **Role-Based Access Control (RBAC)**: Secure API endpoints restricted to `organizer` or `customer`.
*   **Event Management**: Organizers can create and update events.
*   **Booking System**: Customers can book tickets (atomic stock management).
*   **Background Tasks Simulation**:
    *   Simulated "Email Service" for booking confirmations.
    *   Simulated "Notification Service" for alerting attendees of event updates.
*   **Local Database**: Uses a real MongoDB instance running via Docker.

## 🛠️ Tech Stack

*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (Official Docker Image)
*   **Authentication**: JWT (JSON Web Tokens)
*   **Tooling**: Nodemon (Hot Reload)

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:
*   **[Node.js](https://nodejs.org/)** (v14 or higher)
*   **[npm](https://www.npmjs.com/)** (Node Package Manager)
*   **[Docker](https://www.docker.com/)** (For running the local MongoDB instance)
*   **[MongoDB Compass](https://www.mongodb.com/products/compass)** (Optional: To visually explore the database)

## 📦 Setup & Installation

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start Database (MongoDB via Docker)**:
    ```bash
    docker run -d --name local-mongo -p 27017:27017 mongo:latest
    ```

3.  **Run Application**:
    ```bash
    npm run dev
    ```
    *The server will start on `http://localhost:3000`*

## 🔑 API Endpoints

### Authentication
*   `POST /api/auth/register` - Register a new user (`role`: 'organizer' or 'customer').
*   `POST /api/auth/login` - Login and receive a JWT Bearer Token.

### Events (Organizer Only)
*   `POST /api/events` - Create a new event.
*   `PUT /api/events/:id` - Update an event **(Triggers Background Notification)**.

### Bookings (Customer Only)
*   `POST /api/bookings` - Book a ticket **(Triggers Background Email)**.
*   `GET /api/bookings` - View my bookings.

### Public
*   `GET /api/events` - List all events.

## 🏗️ Design Decisions

### 1. Database Schema
*   **User Model**: Stores `role` directly in the schema to simplify RBAC checks without needing complex permission tables. Password hashing is handled via `bcryptjs` middleware on save.
*   **Event Model**: Includes `availableTickets` count.
*   **Booking Model**: Links `User` and `Event`.

### 2. Concurrency & Data Integrity
*   **Ticket Booking**: Initially designed with MongoDB Transactions (Replica Set). However, adapted to **Standard Save** for compatibility with standalone local MongoDB installations.
*   **Integrity Check**: The booking controller explicitly checks `availableTickets > 0` before saving to prevent overbooking.

### 3. Background Processing
*   **Decision**: Uses Node.js internal `EventEmitter` instead of external queues (like RabbitMQ/Redis).
*   **Reason**: For a standalone assignment, this avoids requiring the evaluator to install heavy infrastructure while still demonstrating the *pattern* of decoupling async tasks (blocking the API response vs background processing).

### 4. Authentication Middleware
*   **`protect`**: Verifies JWT.
*   **`authorize(role)`**: Hardcoded role checks in route definitions (e.g., `authorize('organizer')`). This provides a clear, declarative security policy right in the route file.

---
**Author**: Omkar
