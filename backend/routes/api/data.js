const express = require('express');
const router = express.Router();
const carouselController = require('../../controllers/carouselController');
const carouselModel = require('../../models/carouselModel');

// Endpoint to get carousel data
router.get('/carousel',carouselController.getCarouselData);

module.exports = router;
