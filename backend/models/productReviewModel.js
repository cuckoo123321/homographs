const db = require('../db');

const productReviewModel = {
    getAll:(offset, limit, cb)=>{
        db.query(
            `SELECT pr.*, p.product_title, u.user_name FROM product_reviews pr 
            JOIN products p ON pr.product_id = p.product_id
            JOIN users u ON pr.user_id = u.user_id
            ORDER BY pr.product_review_created_at DESC LIMIT ?, ?`,
            [offset, limit],
            (err, results)=>{
                if (err) return cb(err);
                cb(null, results);
            }
        );
    },
    
    getCount:(cb)=>{
        db.query(`SELECT COUNT(*) AS count FROM product_reviews`,(err, results)=>{
            if(err) return cb(err);
            const count = results[0].count;
            cb(null, count);
        })
    },

}

module.exports = productReviewModel;