const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/orderController');


router.post('/orderAdd', orderController.createOrder);  
router.get('/order/:order_id', orderController.getOrderById);
router.post('/paymentAdd/:order_id', orderController.createPayment);
router.get('/getPaymentResult/:payment_id', orderController.getPaymentResult);
router.get('/orderList/:user_id', orderController.getAllOrdersByUserId);
// router.post('/payment/:order_id', orderController.GetCheckValue);
// router.get('/payment/:order_id', orderController.GetCheckValue);


module.exports = router;