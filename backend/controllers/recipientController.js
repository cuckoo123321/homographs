const recipientModel = require('../models/recipientModel');

const recipientController = {
    addRecipient: async (req, res) => {
        const { user_id, user_name, order_number, recipient_name, recipient_phone, recipient_residence, recipient_address } = req.body;
    
        try {
          const result = await recipientModel.addRecipient(
            user_id,
            user_name,
            order_number,
            recipient_name,
            recipient_phone,
            recipient_residence,
            recipient_address
          );
    
          res.status(201).json({
            success: true,
            data: result,
            message: 'Recipient created successfully',
          });
        } catch (error) {
          console.error('Error creating recipient:', error);
          res.status(500).json({
            success: false,
            error: 'Internal Server Error',
          });
        }
      },
}

module.exports = recipientController;