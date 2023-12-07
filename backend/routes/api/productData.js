const express = require('express');
const router = express.Router();
const productModel = require('../../models/productModel');
const productController = require('../../controllers/productController');

// Endpoint to get product data
router.get('/product', async (req, res) => {
    try {
        const productData = await productModel.getProductData();
        res.json(productData);
    } catch (error) {
        console.error('Error fetching product data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:id', productController.getProductById);

module.exports = router;