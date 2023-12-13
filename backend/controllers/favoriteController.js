const favoriteModel = require('../models/favoriteModel');

const favoriteController = {
    addToFavorites: async (req, res) => {
        try {
          const { user_id, product_id } = req.body;
    
          // 調用 favoriteModel 中的 addFavorite 方法
          const result = await favoriteModel.addFavorite(user_id, product_id);
    
          // 返回成功的回應，可以包括插入後的 favorite 資訊
          res.status(200).json({ message: '成功將商品加入收藏清單', favorite: result });
        } catch (error) {
          console.error('Error adding to favorites:', error);
          // 檢查是否為唯一鍵衝突
          if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
                return res.status(400).json({ error: '該商品已存在收藏清單中' });
           }
          // 返回錯誤的回應
          res.status(500).json({ error: '伺服器錯誤' });
        }
      },

      getFavorite: async (req, res) => {
        try {
          const { user_id } = req.params; // 使用路由參數來傳遞 user_id
          const favorites = await favoriteModel.getFavorite(user_id);
    
          // 回傳成功時的 JSON 回應
          //console.log('data', favorites)
          res.status(200).json({ success: true, data: favorites });
        } catch (error) {
          console.error('Error getting favorites:', error);
          // 回傳錯誤時的 JSON 回應
          res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
      },

      removeFromFavorites: async (req, res) => {
        const { favorite_id } = req.params;
    
        try {
          const result = await favoriteModel.removeFavorite(favorite_id);
          res.json({
            success: result.success,
            message: result.success ? '成功移除收藏' : '找不到要移除的收藏',
          });
        } catch (error) {
          console.error('Error removing favorite:', error);
          res.status(500).json({
            success: false,
            message: '移除收藏失敗',
          });
        }
      },
}

module.exports = favoriteController;