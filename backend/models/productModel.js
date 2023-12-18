const db = require('../db');
const path = require('path');

const productModel = {
    add: (product, cb) => {
        db.query(
            `INSERT INTO products(product_number, product_path, product_title, product_price, product_discount, product_description, product_category, product_stock, product_publish) values(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                product.product_number, 
                product.product_path, 
                product.product_title, 
                product.product_price, 
                product.product_discount, 
                product.product_description, 
                product.product_category, 
                product.product_stock, 
                product.product_publish
            ],
            (err, results) => {
                if (err) return cb(err);
                cb(null, results);
            }
        );
    },

    getAll:(offset, limit, cb) => {
        db.query(
            `SELECT * FROM products ORDER BY product_number ASC LIMIT ?, ?`,
            [offset, limit],
            (err, results) => {
                if(err) return cb(err);
                cb(null, results);
            }
        )
    },
    getCount:(cb)=> {
        db.query(
            `SELECT COUNT(*) AS count FROM products`, (err, results) => 
            {
                if(err) return cb(err);
                const count = results[0].count;
                cb(null, count);
            }
        )
    },

    delete: (product_id, cb) => {
        db.query('DELETE FROM products WHERE product_id = ?', [product_id], (err, results) => {
          if (err) return cb(err);
          cb(null);
        });
    },
    getFilePath: (product_id, cb) => {
        db.query('SELECT product_path FROM products WHERE product_id = ?', [product_id], (err, results) => {
          if (err) {
            return cb(err);
          }
      
          if (results.length === 0) {
            return cb(new Error('product not found'));
          }
      
          const filePath = results[0].product_path;
          
          // 使用 path.join 來組成完整路徑，要找到 backend/uploads
          const absolutePath = path.join(__dirname, '..','uploads', filePath);
          // console.log('Absolute path:', absolutePath);
          cb(null, absolutePath);
        });
      },

    getUpdate:(product_id, cb)=>{
        db.query(
            `SELECT * FROM products WHERE product_id = ?`,[product_id],
            (err, results) => {
            if(err) return cb (err);
            cb(null, results[0] || {});
            }
        );
    },


    update: (product_number, newImageFilename, product_title, product_price, product_discount, product_description, product_category, product_stock, product_publish, product_updated_at, product_id, cb) => {
        const query = 'UPDATE products SET product_number = ?, product_path = ?, product_title = ?, product_price = ?, product_discount = ?, product_description = ?, product_category = ?, product_stock = ?, product_publish = ?, product_updated_at = ? WHERE product_id = ?';

        db.query(query,
            [
                product_number, 
                newImageFilename, // 將新圖片的檔名作為參數傳入
                product_title, 
                product_price, 
                product_discount, 
                product_description, 
                product_category, 
                product_stock, 
                product_publish, 
                product_updated_at,
                product_id
            ],
            (err, results) => {
                if (err) return cb(err);
                cb(null);
            }
        );
    },

    // Function to get data from the database (API)
    getProductData: () => {
        return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM products WHERE product_publish = 'publish' `, (error, results) => {
            if (error) {
            reject(error);
            } else {
            resolve(results);
            }
        });
        });
    },

    getProductById: (product_id, cb) => {
        db.query('SELECT * FROM products WHERE product_id = ?', [product_id], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return cb(err);
            }
            // 檢查是否找到商品
            if (results.length === 0) {
                const notFoundError = new Error('Product not found');
                return cb(notFoundError);
            }        
            cb(null, results[0]);// 找到商品，回傳結果
        });
    },

    updateProductStock: (productId, newStock) => {
        return new Promise((resolve, reject) => {
          db.query(
            'UPDATE products SET product_stock = ? WHERE product_id = ?',
            [newStock, productId],
            (err, result) => {
              if (err) {
                console.error('Database error:', err);
                return reject(err);
              }
              resolve({
                success: true,
                message: 'Product stock updated successfully',
              });
            }
          );
        });
    },




}

module.exports = productModel;