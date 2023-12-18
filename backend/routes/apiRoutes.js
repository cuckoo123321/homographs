const express = require('express');
const router = express.Router();
const dataRoutes = require('./api/data');
const productRoutes = require('./api/productData');
const eventRoutes = require('./api/eventData');
const userRoutes = require('./api/userData');
const favoriteRoutes = require('./api/favoriteData');
const cartRoutes = require('./api/cartData');
const recipientRoutes = require('./api/recipientData');
const orderRoutes = require('./api/orderData');


router.use('/api/data', dataRoutes);
router.use('/api/productData', productRoutes);
router.use('/api/eventData', eventRoutes);
router.use('/api/userData', userRoutes);
router.use('/api/favoriteData', favoriteRoutes);
router.use('/api/cartData', cartRoutes);
router.use('/api/recipientData', recipientRoutes);
router.use('/api/orderData', orderRoutes);

module.exports = router;
