const express = require('express');
const router = express.Router();
const recipientController = require('../../controllers/recipientController');


router.post('/addRecipient', recipientController.addRecipient);  


module.exports = router;