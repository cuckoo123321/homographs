const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const authenticate = require('../../middleware/authenticate'); // 驗證 JWT 的 middleware

// 登入路由
router.post('/userLogin', userController.userLogin);
// 使用者資訊路由，需要驗證 JWT
router.get('/user', authenticate, userController.getUserInfo);

// 註冊路由
router.post('/userRegister', userController.userRegister);  

// 更新使用者資料路由，需要驗證 JWT
router.put('/userUpdate/:id', authenticate, userController.FrontendHandleUpdate);


module.exports = router;