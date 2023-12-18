const db = require('../db');

const recipientModel = {
    addRecipient: (user_id, user_name, order_number, recipient_name, recipient_phone, recipient_residence, recipient_address) => {
        return new Promise((resolve, reject) => {
          db.query(
            'INSERT INTO recipients (user_id, user_name,order_number, recipient_name, recipient_phone, recipient_residence, recipient_address) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [user_id, user_name, order_number, recipient_name, recipient_phone, recipient_residence, recipient_address],
            (err, result) => {
              if (err) {
                console.error('Database error:', err);
                return reject(err);
              }
    
              // 返回插入後的結果，你可以根據需要返回其他相關資訊
              resolve({
                recipient_id: result.insertId,
                user_id: user_id,
                user_name: user_name,
                order_number: order_number,
                recipient_name: recipient_name,
                recipient_phone: recipient_phone,
                recipient_residence: recipient_residence,
                recipient_address: recipient_address,
                recipient_created_at: result.affectedRows > 0 ? result.timestamp : null,
                recipient_updated_at: result.affectedRows > 0 ? result.timestamp : null,
              });
            }
          );
        });
      },
};

module.exports = recipientModel;