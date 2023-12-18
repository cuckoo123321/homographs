const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/orderController');


router.post('/orderAdd', orderController.createOrder);  
router.get('/order/:order_id', orderController.getOrderById);
router.post('/payment/:order_id', orderController.GetCheckValue);
router.get('/payment/:order_id', orderController.GetCheckValue);

module.exports = router;