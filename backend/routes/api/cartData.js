const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/cartController');


router.post('/addToCart', cartController.addToCart);
router.get('/cartList/:user_id?', cartController.getCartItems);
router.put('/updateQuantity/:user_id/:product_id', cartController.updateCartQuantity);
router.delete('/deleteCartItem/:user_id/:product_id', cartController.deleteCartItem);


module.exports = router;