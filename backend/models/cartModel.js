const db = require('../db');

const cartModel = {
  addToCart: (user_id, product_id, quantity) => {
    return new Promise((resolve, reject) => {
      // 使用 ON DUPLICATE KEY UPDATE 來處理商品已存在於購物車的情況
      db.query(
        'INSERT INTO carts (user_id, product_id, quantity, cart_created_at) VALUES (?, ?, ?, NOW()) ' +
        'ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)',
        [user_id, product_id, quantity],
        (err, result) => {
          if (err) {
            console.error('Database error:', err);
            return reject(err);
          }

          // 返回插入後的結果
          resolve({
            cart_id: result.insertId,
            user_id: user_id,
            product_id: product_id,
            quantity: quantity,
            cart_created_at: new Date()
          });
        }
      );
    });
  },

  getCartItems: (user_id) => {
    return new Promise((resolve, reject) => {
      // 使用 JOIN 操作獲取相應的商品資訊
      db.query(
        'SELECT products.product_id, products.product_title, products.product_discount, products.product_stock, carts.quantity ' +
        'FROM carts ' +
        'JOIN products ON carts.product_id = products.product_id ' +
        'WHERE carts.user_id = ? AND products.product_publish = "publish"',
        [user_id],
        (err, result) => {
          if (err) {
            console.error('Database error:', err);
            return reject(err);
          }

          // 返回查詢結果
          resolve(result);
        }
      );
    });
  },

  updateCartQuantity: (user_id, product_id, quantity) => {
    return new Promise((resolve, reject) => {
      // 使用 UPDATE 來更新購物車商品數量
      db.query(
        'UPDATE carts SET quantity = ? WHERE user_id = ? AND product_id = ?',
        [quantity, user_id, product_id],
        (err, result) => {           
          if (err) {
            console.error('Database error:', err);
            return reject(err);
          }

          // 返回更新後的結果
          resolve(result);
        }
      );
    });
  },

  deleteCartItem: (user_id, product_id, callback) => {
    db.query(
      'DELETE FROM carts WHERE user_id = ? AND product_id = ?',
      [user_id, product_id],
      (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return callback(err, null);
        }

        return callback(null, result);
      }
    );
  },
};

module.exports = cartModel;
