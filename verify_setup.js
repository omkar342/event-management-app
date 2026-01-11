const axios = require('axios');
const mongoose = require('mongoose');

const BASE_URL = 'http://localhost:3000/api';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runVerification() {
    try {
        console.log('--- STARTING VERIFICATION ---');

        // 1. Register Organizer
        console.log('\n[1] Registering Organizer...');
        try {
            await axios.post(`${BASE_URL}/auth/register`, {
                username: 'organizer1',
                email: 'organizer@test.com',
                password: 'password123',
                role: 'organizer'
            });
        } catch (e) {
            // Ignore if already exists for re-run capability
            if (e.response && e.response.status !== 400) throw e;
        }

        const orgLogin = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'organizer@test.com',
            password: 'password123'
        });
        const orgToken = orgLogin.data.token;
        console.log('Organizer logged in.');

        // 2. Register Customer
        console.log('\n[2] Registering Customer...');
        try {
            await axios.post(`${BASE_URL}/auth/register`, {
                username: 'customer1',
                email: 'customer@test.com',
                password: 'password123',
                role: 'customer'
            });
        } catch (e) {
            if (e.response && e.response.status !== 400) throw e;
        }

        const custLogin = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'customer@test.com',
            password: 'password123'
        });
        const custToken = custLogin.data.token;
        console.log('Customer logged in.');

        // 3. Create Event (as Organizer)
        console.log('\n[3] Creating Event...');
        const eventRes = await axios.post(`${BASE_URL}/events`, {
            title: 'Tech Conference 2024',
            description: 'A great tech conference.',
            date: '2024-12-01',
            location: 'Tech Hub',
            totalTickets: 100,
            price: 50
        }, {
            headers: { Authorization: `Bearer ${orgToken}` }
        });
        const eventId = eventRes.data._id;
        console.log(`Event created: ${eventRes.data.title} (ID: ${eventId})`);

        // 4. Book Event (as Customer)
        console.log('\n[4] Booking Event...');
        const bookingRes = await axios.post(`${BASE_URL}/bookings`, {
            eventId: eventId
        }, {
            headers: { Authorization: `Bearer ${custToken}` }
        });
        console.log(`Booking successful! Booking ID: ${bookingRes.data._id}`);
        console.log('...Waiting for Background Task (Confirmation Email)...');
        await sleep(2000); 

        // 5. Update Event (as Organizer)
        console.log('\n[5] Updating Event (Trigger Notification)...');
        const updateRes = await axios.put(`${BASE_URL}/events/${eventId}`, {
            title: 'Tech Conference 2024 (UPDATED)',
            description: 'Updated description.'
        }, {
            headers: { Authorization: `Bearer ${orgToken}` }
        });
        console.log(`Event updated: ${updateRes.data.title}`);
        console.log('...Waiting for Background Task (Update Notification)...');
        await sleep(2000);

        console.log('\n--- VERIFICATION COMPLETE (Check server logs for Background Tasks) ---');

    } catch (error) {
        console.error('Verification Failed:', error.response ? error.response.data : error.message);
    }
}

// We need the server to be running separately.
// This script just makes requests.
runVerification();
