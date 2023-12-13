const express = require('express');
const router = express.Router();
const favoriteController = require('../../controllers/favoriteController');

// POST 請求處理添加到收藏清單的路由
router.post('/favoriteAdd', favoriteController.addToFavorites);
router.get('/favoriteList/:user_id?', favoriteController.getFavorite);
// DELETE 請求處理移除收藏清單的路由
router.delete('/favoriteRemove/:favorite_id', favoriteController.removeFromFavorites);

module.exports = router;