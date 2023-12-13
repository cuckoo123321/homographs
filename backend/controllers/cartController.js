const cartModel = require('../models/cartModel');

const cartController = {
    addToCart: async (req, res) => {
        try {
          const { user_id, product_id, quantity } = req.body;
      
          // 調用 cartModel 中的 addToCart 方法
          const result = await cartModel.addToCart(user_id, product_id, quantity);
      
          // 返回成功的回應，可以包括插入後的 cart 資訊
          res.status(200).json({ success: true, message: '成功將商品加入購物車', cart: result });
        } catch (error) {
          console.error('Error adding to cart:', error);
      
          // 檢查是否為唯一鍵衝突
          if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            return res.status(400).json({ success: false, error: '該商品已存在購物車中' });
          }
      
          // 返回錯誤的回應
          res.status(500).json({ success: false, error: '伺服器錯誤' });
        }
      },

    
      getCartItems: async (req, res) => {
        try {
          const { user_id } = req.params;
    
          // 調用 cartModel 中的 getCartItems 方法
          const result = await cartModel.getCartItems(user_id);
    
          // 返回成功的回應，可以包括購物車項目的資訊
          res.status(200).json({ success: true, data: result });
        } catch (error) {
          console.error('Error getting cart items:', error);
          // 返回錯誤的回應
          res.status(500).json({ error: '伺服器錯誤' });
        }
      },

      updateCartQuantity: async (req, res) => {
        try {
          const { user_id, product_id } = req.params;
          const { quantity } = req.body;
      
          // 調用 cartModel 中的 updateCartQuantity 方法
          const result = await cartModel.updateCartQuantity(user_id, product_id, quantity);
      
          // 返回成功的回應，可以包括更新後的 cart 資訊
          res.status(200).json({ success: true, message: '成功更新購物車數量', cart: result });
        } catch (error) {
          console.error('Error updating cart quantity:', error);
          // 返回錯誤的回應
          res.status(500).json({ success: false, error: '伺服器錯誤' });
        }
    },

    deleteCartItem: (req, res) => {
        const { user_id, product_id } = req.params;
    
        cartModel.deleteCartItem(user_id, product_id, (err, result) => {
          if (err) {
            console.error('Error deleting cart item:', err);
            return res.status(500).json({ success: false, error: 'Failed to delete cart item' });
          }
    
          if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'Cart item not found' });
          }
    
          return res.json({ success: true, message: 'Cart item deleted successfully' });
        });
      },
    
}

module.exports = cartController;