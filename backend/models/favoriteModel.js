const db = require('../db');

const favoriteModel = {
    addFavorite: (user_id, product_id) => {
        return new Promise((resolve, reject) => {
          db.query('INSERT INTO favorites (user_id, product_id) VALUES (?, ?)', [user_id, product_id], (err, result) => {
            if (err) {
              console.error('Database error:', err);
              return reject(err);
            }
    
            // 返回插入後的結果
            resolve({
              favorite_id: result.insertId,
              user_id: user_id,
              product_id: product_id,
            });
          });
        });
      },

      getFavorite: (user_id) => {
        return new Promise((resolve, reject) => {
          // 使用 JOIN 操作獲取相應的商品資訊
          db.query(
            'SELECT favorites.favorite_id, favorites.user_id, favorites.product_id, products.product_title, products.product_discount ' +
            'FROM favorites ' +
            'JOIN products ON favorites.product_id = products.product_id ' +
            'WHERE favorites.user_id = ? AND products.product_publish = "publish"',
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

      removeFavorite: (favorite_id) => {
        return new Promise((resolve, reject) => {
          db.query('DELETE FROM favorites WHERE favorite_id = ?', [favorite_id], (err, result) => {
            if (err) {
              console.error('Database error:', err);
              return reject(err);
            }
    
            // 返回刪除後的結果
            resolve({
              favorite_id: favorite_id,
              success: result.affectedRows > 0,
            });
          });
        });
      },
}

module.exports = favoriteModel;