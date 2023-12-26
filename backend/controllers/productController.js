const productModel = require('../models/productModel');
const itemsPerPage = 30;
const multer = require('multer'); // 用於處理上傳的中間件
const path = require('path');
const fs = require('fs');
// const iconv = require('iconv-lite');

const uploadDir = path.join(__dirname, '../uploads');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // 檢查目錄是否存在，不存在則創建
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {    
       cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

const productController = {
    add: (req, res) => {
        res.render('product/productAdd');
    },

    handleAdd: (req, res, next) => {
        upload.single('product_path')(req, res, async (err) => {
            if (err) {
                console.error('檔案上傳失敗:', err);
                res.status(500).send('檔案上傳失敗');
            } else {
                try {
                    // 在這裡處理檔案上傳後的邏輯
                    // 1. 獲取上傳的檔案名稱
                    const filename = req.file.filename;

                    // 2. 檢查其他必要欄位
                    const { product_number, product_title, product_price, product_discount, product_description, product_category, product_stock, product_publish } = req.body;
                    if (!product_number || !filename || !product_title || !product_price) {
                        req.flash('errorMessage', '缺少必要欄位');
                        return next();
                    }
    
                    // 3. 準備 product 物件
                    const product = {
                        product_number,
                        product_path: filename,
                        product_title,
                        product_price, product_discount, product_description, product_category, product_stock, product_publish
                    };
    
                    // 4. 將資料儲存到資料庫
                    productModel.add(product, (addErr, result) => {
                        // 檢查是否有資料庫操作錯誤
                        if (addErr) {
                            console.error('資料庫操作失敗:', addErr);
                            req.flash('errorMessage', addErr.toString());
                            return next();
                        }    
                        res.redirect('/productList');
                    });
                } catch (dbError) {
                    console.error('資料庫操作失敗:', dbError);
                    req.flash('errorMessage', dbError.toString());
                    return next();
                }
            }
        });
    },

    getAll: (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * itemsPerPage;
        const limit = itemsPerPage;

        productModel.getAll(offset, limit, (err, results) => {
            if(err){
                console.log(err);
                return res.status(500).send('Internal Server Error');
            }
            productModel.getCount((err, count) => {
                if(err){
                    console.log(err);
                    return res.status(500).send('Internal Server Error');
                }
                const totalPages = Math.ceil(count / itemsPerPage);
                res.render('product/productList', {
                    product: results,
                    currentPage: page,
                    totalPages: totalPages,
                });
            });
        });
    },

    delete: (req, res) => {
        const productID = req.params.id;
      
        // 先取得要刪除的檔案路徑
        productModel.getFilePath(productID, (filePathErr, filePath) => {
          if (filePathErr) {
            console.error('Error getting file path:', filePathErr);
            res.status(500).send('Error getting file path');
            return;
          }
      
          // 使用 fs.unlink 刪除檔案
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
              if (unlinkErr.code === 'ENOENT') {
                console.log('File does not exist');
              } else {
                console.error('Error deleting file:', unlinkErr);
              }
            } 
      
            // 繼續執行資料庫中的刪除操作
            productModel.delete(productID, (deleteErr) => {
              if (deleteErr) {
                console.error('Error deleting product:', deleteErr);
              }
              res.redirect('/productList');
            });
          });
        });
    },

    update:(req, res) => {
        productModel.getUpdate(req.params.id, (err, result)=>{
            res.render('product/productUpdate',{
                product: result,
                imagePath: result.product_path // 將圖片路徑傳遞給模板
            })
        })
    },

    handleUpdate: (req, res, next) => {
        upload.single('newImage')(req, res, async (err) => {
            if (err) {
                console.error('檔案上傳失敗:', err);
                res.status(500).send('檔案上傳失敗');
            } else {
                try {
                    const product_updated_at = new Date();
                    const { product_number, product_title, product_price, product_discount, product_description, product_category, product_stock, product_publish } = req.body;
                    const productID = req.params.id;
                    const originalPath = req.body.product_path;
    
                    // 檢查是否有新圖片上傳
                    if (req.file) {
                        // 如果有新圖片，先刪除舊圖片
                        productModel.getFilePath(productID, (filePathErr, filePath) => {
                            if (filePathErr) {
                                console.error('Error getting file path:', filePathErr);
                                res.status(500).send('Error getting file path');
                                return;
                            }
    
                            // 檢查檔案是否存在
                            if (fs.existsSync(filePath)) {
                                // 使用 fs.unlink 刪除舊圖片
                                fs.unlink(filePath, (unlinkErr) => {
                                    if (unlinkErr) {
                                        if (unlinkErr.code === 'ENOENT') {
                                            console.log('File does not exist');
                                        } else {
                                            console.error('Error deleting old file:', unlinkErr);
                                        }
                                    }
    
                                    // 繼續執行資料庫中的更新操作，將新圖片的檔名作為參數傳入
                                    productModel.update(
                                        product_number, req.file.filename,product_title, product_price, product_discount, product_description, product_category, product_stock, product_publish, product_updated_at,
                                        productID,
                                        
                                        (updateErr) => {
                                            if (updateErr) {
                                                console.error('Error updating product:', updateErr);
                                            } else {
                                                res.redirect('/productList');
                                            }
                                        }
                                    );
                                });
                            } else {
                                console.log('File does not exist');
                                // 繼續執行資料庫中的更新操作，將新圖片的檔名作為參數傳入
                                productModel.update(
                                    product_number, 
                                    req.file.filename,
                                    product_title, product_price, product_discount, product_description, product_category, product_stock, product_publish, product_updated_at,
                                    productID,
                                    
                                    (updateErr) => {
                                        if (updateErr) {
                                            console.error('Error updating product:', updateErr);
                                        } else {
                                            res.redirect('/productList');
                                        }
                                    }
                                );
                            }
                        });
                    } else {
                        // 沒有新圖片上傳，還是要傳遞原本的圖片的檔名
                        productModel.update(
                            product_number, originalPath, product_title, product_price, product_discount, product_description, product_category, product_stock, product_publish, product_updated_at,
                            productID,
                            
                            (updateErr) => {
                                if (updateErr) {
                                    console.error('Error updating product:', updateErr);
                                } else {
                                    res.redirect('/productList');
                                }
                            }
                        );
                    }
                } catch (dbError) {
                    console.error('資料庫操作失敗:', dbError);
                    req.flash('errorMessage', dbError.toString());
                    return next();
                }
            }
        });
    },

    //前端用的API
    getProductById: (req, res) => {
        const product_id = req.params.id;
        
        productModel.getProductById(product_id, (err, product) => {
            if (err) {
                if (err.message === 'Product not found') {
                    // 找不到商品的處理方式
                    res.status(404).json({ error: 'Product not found' });
                } else {
                    // 其他資料庫錯誤的處理方式
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            } else {
                res.json(product);
            }
        });
    },
    //訂單成立後自動更新庫存
    updateProductStock: async (req, res) => {
        const { productId, newStock } = req.body;
    
        try {
          // 使用 productModel.updateProductStock 更新庫存
          const result = await productModel.updateProductStock(productId, newStock);
    
          res.json(result);
        } catch (error) {
          console.error('Error updating product stock:', error);
          res.status(500).json({
            success: false,
            error: 'Internal server error',
          });
        }
      },
    
      
}

module.exports = productController;