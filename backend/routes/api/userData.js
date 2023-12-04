const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const authenticate = require('../../middleware/authenticate'); // 驗證 JWT 的 middleware

// const userModel = require('../../models/userModel');

// // Endpoint to get user data
// router.get('/user', async (req, res) => {
//     try {
//         const userData = await userModel.getUserData();
//         res.json(userData);
//     } catch (error) {
//         console.error('Error fetching user data:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// 登入路由
router.post('/userLogin', userController.userLogin);
// 使用者資訊路由，需要驗證 JWT
router.get('/user', authenticate, userController.getUserInfo);

// 註冊路由
router.post('/userRegister', userController.userRegister);  


module.exports = router;