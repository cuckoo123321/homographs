const db = require('../db');
const path = require('path');

const carouselModel = {
    add: (carousel, cb) => {
        db.query(
            `INSERT INTO carousels(carousel_title, carousel_path, carousel_publish) values(?, ?, ?)`,
            [
                carousel.carousel_title,
                carousel.carousel_path,
                carousel.carousel_publish
            ],
            (err, results) => {
                if (err) return cb(err);
                cb(null, results);
            }
        );
    },


  getAll: (cb) =>{    
    db.query(
      `SELECT * FROM carousels`,
      (err, results) => {
        if(err) return cb (err);
        cb(null, results);
      }
    );
  },

  delete: (carousel_id, cb) => {
    db.query('DELETE FROM carousels WHERE carousel_id = ?', [carousel_id], (err, results) => {
      if (err) return cb(err);
      cb(null);
    });
  },

  getFilePath: (carousel_id, cb) => {
    db.query('SELECT carousel_path FROM carousels WHERE carousel_id = ?', [carousel_id], (err, results) => {
      if (err) {
        return cb(err);
      }
  
      if (results.length === 0) {
        return cb(new Error('Carousel not found'));
      }
  
      const filePath = results[0].carousel_path;
      
      // 使用 path.join 來組成完整路徑，要找到 backend/uploads
      const absolutePath = path.join(__dirname, '..','uploads', filePath);
      // console.log('Absolute path:', absolutePath);
      cb(null, absolutePath);
    });
  },
  

  getUpdate:(carousel_id, cb)=>{
    db.query(
      `SELECT * FROM carousels WHERE carousel_id = ?`,[carousel_id],
      (err, results) => {
        if(err) return cb (err);
        cb(null, results[0] || {});
      }
    );
  },


  update: (carousel_title, carousel_updated_at, carousel_publish, carousel_id, newImageFilename, cb) => {
    const query = 'UPDATE carousels SET carousel_title = ?, carousel_updated_at = ?, carousel_publish = ?, carousel_path = ? WHERE carousel_id = ?';

    db.query(query,
        [
            carousel_title,
            carousel_updated_at,
            carousel_publish,
            newImageFilename, // 將新圖片的檔名作為參數傳入
            carousel_id
        ],
        (err, results) => {
            if (err) return cb(err);
            cb(null);
        }
    );
  },


  

}

module.exports = carouselModel;