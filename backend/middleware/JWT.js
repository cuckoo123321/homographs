const jwt = require('jsonwebtoken');

// 在登入成功後生成 JWT
const generateToken = (user) => {
    const secretKey = process.env.JWT_SECRET;

    const token = jwt.sign(
        { userId: user.user_id, userName: user.user_name },
        secretKey, 
        { expiresIn: '24h' } // 設定過期時間
    );
    return token;
}

module.exports = generateToken;