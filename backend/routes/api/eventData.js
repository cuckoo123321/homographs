const express = require('express');
const router = express.Router();
const eventModel = require('../../models/eventModel');

// Endpoint to get event data
router.get('/event', async (req, res) => {
    try {
        const eventData = await eventModel.getEventData();
        res.json(eventData);
    } catch (error) {
        console.error('Error fetching event data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;