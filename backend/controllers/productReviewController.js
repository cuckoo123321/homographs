const productReviewModel = require('../models/productReviewModel');
const itemsPerPage = 10;

const productReviewController = {
    getAll: (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * itemsPerPage;
        const limit = itemsPerPage;
    
        productReviewModel.getAll(offset, limit, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Internal Server Error');
            }
            productReviewModel.getCount((err, count) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Internal Server Error');
                }
                const totalPages = Math.ceil(count / itemsPerPage);
                res.render('productReview/productReviewList', {
                    productReview: results,
                    currentPage: page,
                    totalPages: totalPages,
                });
            });
        });
    },
}

module.exports = productReviewController;