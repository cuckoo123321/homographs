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
};

module.exports = orderModel;
