const carouselModel = require('../models/carouselModel');
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

function updateCarouselInDatabase(carouselID, title, publish, updated_at, newImageFilename) {
    carouselModel.update(
        title,
        updated_at,
        publish,
        carouselID,
        newImageFilename,
        (err) => {
            if (err) {
                console.error('Error updating carousel:', err);
            } else {
                res.redirect('/carouselList');
            }
        }
    );
}

const carouselController = {
    add: (req, res) => {
        res.render('carousel/carouselAdd');
    },

    handleAdd: (req, res, next) => {
        upload.single('carousel_path')(req, res, async (err) => {
            if (err) {
                console.error('檔案上傳失敗:', err);
                res.status(500).send('檔案上傳失敗');
            } else {
                try {
                    // 在這裡處理檔案上傳後的邏輯
                    // 1. 獲取上傳的檔案名稱
                    const filename = req.file.filename;

                    // 2. 檢查其他必要欄位
                    const { carousel_title, carousel_publish } = req.body;
                    if (!carousel_title || !filename || !carousel_publish) {
                        req.flash('errorMessage', '缺少必要欄位');
                        return next();
                    }
    
                    // 3. 準備 carousel 物件
                    const carousel = {
                        carousel_title,
                        carousel_path: filename,
                        carousel_publish
                    };
    
                    // 4. 將資料儲存到資料庫
                    carouselModel.add(carousel, (addErr, result) => {
                        // 檢查是否有資料庫操作錯誤
                        if (addErr) {
                            console.error('資料庫操作失敗:', addErr);
                            req.flash('errorMessage', addErr.toString());
                            return next();
                        }    
                        res.redirect('/carouselList');
                    });
                } catch (dbError) {
                    console.error('資料庫操作失敗:', dbError);
                    req.flash('errorMessage', dbError.toString());
                    return next();
                }
            }
        });
    },
    
    getAll: (req, res)=>{
        carouselModel.getAll((err, results)=>{
          if(err){
            console.log(err);
          }
          res.render('carousel/carouselList',{
            carousel: results,
          });
        })
    },

    update:(req, res) => {
        carouselModel.getUpdate(req.params.id, (err, result)=>{
            res.render('carousel/carouselUpdate',{
                carousel: result,
                imagePath: result.carousel_path // 將圖片路徑傳遞給模板
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
                    const carousel_updated_at = new Date();
                    const { carousel_title, carousel_publish } = req.body;
                    const carouselID = req.params.id;
                    const originalPath = req.body.carousel_path;
    
                    // 檢查是否有新圖片上傳
                    if (req.file) {
                        // 如果有新圖片，先刪除舊圖片
                        carouselModel.getFilePath(carouselID, (filePathErr, filePath) => {
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
                                    carouselModel.update(
                                        carousel_title,
                                        carousel_updated_at,
                                        carousel_publish,
                                        carouselID,
                                        req.file.filename,
                                        (updateErr) => {
                                            if (updateErr) {
                                                console.error('Error updating carousel:', updateErr);
                                            } else {
                                                res.redirect('/carouselList');
                                            }
                                        }
                                    );
                                });
                            } else {
                                console.log('File does not exist');
                                // 繼續執行資料庫中的更新操作，將新圖片的檔名作為參數傳入
                                carouselModel.update(
                                    carousel_title,
                                    carousel_updated_at,
                                    carousel_publish,
                                    carouselID,
                                    req.file.filename,
                                    (updateErr) => {
                                        if (updateErr) {
                                            console.error('Error updating carousel:', updateErr);
                                        } else {
                                            res.redirect('/carouselList');
                                        }
                                    }
                                );
                            }
                        });
                    } else {
                        // 沒有新圖片上傳，還是要傳遞原本的圖片的檔名
                        carouselModel.update(
                            carousel_title,
                            carousel_updated_at,
                            carousel_publish,
                            carouselID,
                            originalPath,
                            (updateErr) => {
                                if (updateErr) {
                                    console.error('Error updating carousel:', updateErr);
                                } else {
                                    res.redirect('/carouselList');
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
    
    
    

    
    

    delete: (req, res) => {
        const carouselID = req.params.id;
      
        // 先取得要刪除的檔案路徑
        carouselModel.getFilePath(carouselID, (filePathErr, filePath) => {
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
            carouselModel.delete(carouselID, (deleteErr) => {
              if (deleteErr) {
                console.error('Error deleting carousel:', deleteErr);
              }
              res.redirect('/carouselList');
            });
          });
        });
    },
    
      
}

module.exports = carouselController;