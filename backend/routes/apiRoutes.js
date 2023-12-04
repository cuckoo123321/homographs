const express = require('express');
const router = express.Router();
const dataRoutes = require('./api/data');
const productRoutes = require('./api/productData');
const eventRoutes = require('./api/eventData');
const userRoutes = require('./api/userData');


router.use('/api/data', dataRoutes);
router.use('/api/productData', productRoutes);
router.use('/api/eventData', eventRoutes);
router.use('/api/userData', userRoutes);


module.exports = router;
