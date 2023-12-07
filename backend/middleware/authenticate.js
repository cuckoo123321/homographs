const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    // 從請求的標頭中獲取 Authorization 標頭
  const token = req.header('Authorization');
  const secretKey = process.env.JWT_SECRET;

   // 檢查是否存在 token
  if (!token) {
    console.log('未提供驗證 JWT')
    return res.status(401).json({ success: false, message: '未提供驗證 JWT' });
  }

  try {
    // 驗證 JWT
    const decoded = jwt.verify(token.replace('Bearer ', ''), secretKey); // 移除 'Bearer ' 字符串
    // 在 req 對象中添加使用者相關信息
    req.user = decoded;

    // 繼續執行下一個 middleware 或路由處理程序
    next();
  } catch (error) {
    console.error('JWT 驗證失敗:', error);
    res.status(401).json({ success: false, message: '驗證失敗' });
  }
};

module.exports = authenticate;
