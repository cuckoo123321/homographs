const db = require('../db');

const orderModel = {
  createOrder: (user_id, order_number, order_products, order_shipping_fee, order_price) => {
    return new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO orders (user_id, order_number, order_products, order_shipping_fee, order_price) VALUES (?, ?, ?, ?, ?)',
        [user_id, order_number, order_products, order_shipping_fee, order_price],
        (err, result) => {
          if (err) {
            console.error('Database error:', err);
            return reject(err);
          }

          // Return the inserted result or other relevant information
          resolve({
            order_id: result.insertId,
            user_id: user_id,
            order_number: order_number,
            order_products: order_products,
            order_shipping_fee: order_shipping_fee,
            order_price: order_price
          });
        }
      );
    });
  },
  //取得單筆訂單內容
  getOrderById: (order_id) => {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM orders WHERE order_id = ?',
        [order_id],
        (err, results) => {
          if (err) {
            console.error('Database error:', err);
            return reject(err);
          }

          if (results.length === 0) {
            return reject({ message: 'Order not found' });
          }

          const order = results[0];
          resolve({
            order_id: order.order_id,
            user_id: order.user_id,
            order_number: order.order_number,
            order_products: order.order_products,
            order_shipping_fee: order.order_shipping_fee,
            order_price: order.order_price,
            order_date: order.order_date
          });
        }
      );
    });
  },

  //特定使用者的訂單列表
  // getAllOrdersByUserId: (user_id) => {
  //   return new Promise((resolve, reject) => {
  //     db.query(
  //       'SELECT * FROM orders o JOIN recipients r ON o.order_number = r.order_number WHERE o.user_id = ? ORDER BY o.order_date DESC',
  //       [user_id],
  //       (err, results) => {
  //         if (err) {
  //           console.error('Database error:', err);
  //           return reject(err);
  //         }

  //         const orders = results.map((order) => {
  //           const recipient = {
  //             recipient_name: order.recipient_name,
  //             recipient_phone: order.recipient_phone,
  //             recipient_residence: order.recipient_residence,
  //             recipient_address: order.recipient_address,
  //           };

  //           return {
  //             order_id: order.order_id,
  //             user_id: order.user_id,
  //             order_number: order.order_number,
  //             order_products: order.order_products,
  //             order_shipping_fee: order.order_shipping_fee,
  //             order_price: order.order_price,
  //             order_date: order.order_date,
  //             recipient: recipient,
  //           };
  //         });

  //         resolve(orders);
  //       }
  //     );
  //   });
  // },
  //使用 LEFT JOIN 以確保即使某些訂單沒有支付記錄，仍然會被擷取
  getAllOrdersByUserId: (user_id) => {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM orders o ' +
        'JOIN recipients r ON o.order_number = r.order_number ' +
        'LEFT JOIN payments p ON o.order_id = p.order_id ' +
        'WHERE o.user_id = ? ' +
        'ORDER BY o.order_date DESC',
        [user_id],
        (err, results) => {
          if (err) {
            console.error('Database error:', err);
            return reject(err);
          }
  
          const orders = results.map((order) => {
            const recipient = {
              recipient_name: order.recipient_name,
              recipient_phone: order.recipient_phone,
              recipient_residence: order.recipient_residence,
              recipient_address: order.recipient_address,
            };
  
            const payment = {
              is_paid: order.is_paid,
              is_success: order.is_success,
              is_delivered: order.is_delivered,
              payment_created_at: order.payment_created_at,
            };
  
            return {
              order_id: order.order_id,
              user_id: order.user_id,
              order_number: order.order_number,
              order_products: order.order_products,
              order_shipping_fee: order.order_shipping_fee,
              order_price: order.order_price,
              order_date: order.order_date,
              recipient: recipient,
              payment: payment,
            };
          });
  
          resolve(orders);
        }
      );
    });
  },
  


  //新增付款紀錄
  createPayment: (user_id, order_id, is_paid, is_success, is_delivered) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO payments (user_id, order_id, is_paid, is_success, is_delivered) VALUES (?, ?, ?, ?, ?)',
            [user_id, order_id, is_paid, is_success, is_delivered],
            (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    return reject(err);
                }
              
                resolve({
                    payment_id: result.insertId,
                    user_id: user_id,
                    order_id: order_id,
                    is_paid: is_paid,
                    is_success: is_success,
                    is_delivered: is_delivered,
                });
            }
        );
    });
  },

  //取得特定訂單的付款紀錄
  getPaymentResult: (payment_id) => {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM payments WHERE payment_id = ?',
        [payment_id],
        (err, results) => {
          if (err) {
            console.error('Database error:', err);
            return reject(err);
          }

          if (results.length === 0) {
            return { success: false, error: '交易失敗，訂單未成立' };
          }

          const payment = results[0];
          resolve({
            payment_id: payment.payment_id,
            user_id: payment.user_id,
            order_id: payment.order_id,
            is_paid: payment.is_paid,
            is_success: payment.is_success,
            is_delivered: payment.is_delivered,
            payment_created_at: payment.payment_created_at,
          });
        }
      );
    });
  },

  //後台顯示所有訂單
  getAllOrders: (cb) => {
    db.query(
        'SELECT * FROM orders o ' +
        'JOIN recipients r ON o.order_number = r.order_number ' +
        'LEFT JOIN payments p ON o.order_id = p.order_id ' +
        'WHERE o.user_id IS NOT NULL AND o.order_id IS NOT NULL ' +
        'ORDER BY o.order_date DESC',
        (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return cb(err, null);
            }

            const orders = results.map((order) => {
                const recipient = {
                    recipient_name: order.recipient_name,
                    recipient_phone: order.recipient_phone,
                    recipient_residence: order.recipient_residence,
                    recipient_address: order.recipient_address,
                };

                const payment = {
                    is_paid: order.is_paid,
                    is_success: order.is_success,
                    is_delivered: order.is_delivered,
                    payment_created_at: order.payment_created_at,
                };

                return {
                    order_id: order.order_id,
                    user_id: order.user_id,
                    order_number: order.order_number,
                    order_products: order.order_products,
                    order_shipping_fee: order.order_shipping_fee,
                    order_price: order.order_price,
                    order_date: order.order_date,
                    recipient: recipient,
                    payment: payment,
                };
            });

            cb(null, orders);
        }
    );
  },
  // 後台刪除訂單
  deleteOrder: (order_number, cb) => {
    db.query('DELETE FROM orders WHERE order_number = ?', [order_number], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return cb(err);
        }
        cb(null);
    });
  },

  //編輯訂單出貨狀態
  updateIsDelivered: (orderID, isDelivered, cb) => {
    db.query('UPDATE payments SET is_delivered = ? WHERE order_id = ?', [isDelivered, orderID], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return cb(err);
        }
        cb(null);
    });
  },

};

module.exports = orderModel;
