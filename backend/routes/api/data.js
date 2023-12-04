const express = require('express');
const router = express.Router();
const carouselModel = require('../../models/carouselModel');

// Endpoint to get carousel data
router.get('/carousel', async (req, res) => {
  try {
    const carouselData = await carouselModel.getCarouselData();
    res.json(carouselData);
  } catch (error) {
    console.error('Error fetching carousel data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
