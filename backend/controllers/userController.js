const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const itemsPerPage = 30;
const jwt = require('jsonwebtoken');
const generateToken = require('../middleware/JWT');

const userController = {
    add: (req, res) => {
        res.render('user/userAdd');
    },
    handleAdd: (req, res, next) => {
        const { user_name, user_password, user_email, user_gender, user_birthdate } = req.body;

        if(!user_name || !user_password || !user_email ){
            req.flash('errorMessage', '缺少必要欄位');
            return next();
        }

        bcrypt.hash(user_password, saltRounds, function (err, hash){
            if(err){
                req.flash('errorMessage', err.toString());
                return next();
            }
            userModel.add({
                user_name, 
                user_password: hash, 
                user_email, 
                user_gender, 
                user_birthdate
            },(err) => {
                if(err){
                    req.flash('errorMessage', err.toString());
                    return next();
                }
                res.redirect('/userList');
            })
        })
    },
    // getAll: (req, res)=>{
    //     userModel.getAll((err, results)=>{
    //         if(err){
    //             console.log(err);
    //         }
    //         res.render('user/userList',{
    //             user: results,
    //         });
    //     })
    // },

    getAll: (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * itemsPerPage;
        const limit = itemsPerPage;

        userModel.getAll(offset, limit, (err, results) => {
            if(err){
                console.log(err);
                return res.status(500).send('Internal Server Error');
            }
            userModel.getCount((err, count) => {
                if(err){
                    console.log(err);
                    return res.status(500).send('Internal Server Error');
                }
                const totalPages = Math.ceil(count / itemsPerPage);
                res.render('user/userList', {
                    user: results,
                    currentPage: page,
                    totalPages: totalPages,
                });
            });
        });
    },

    update:(req, res)=> {
        userModel.getUpdate(req.params.id, (err, result) => {
            res.render('user/userUpdate',{
                user: result
            })
        })
    },

    handleUpdate:(req, res) => {
        bcrypt.hash(req.body.user_password, saltRounds, (err, hash) => {
            if(err) return cb(err);
            const user_updated_at = new Date();
            userModel.update(
                req.body.user_name, 
                hash,
                req.body.user_email, 
                req.body.user_gender, 
                req.body.user_birthdate, 
                user_updated_at,
                req.params.id,
                (err) => {
                    if(err){
                        console.log('Error:', err);
                    }else{
                        res.redirect('/userList');
                    }
                    
                }
            );
        });
    },

    softDelete:(req, res) => {
        const user_id = req.params.id;

         // 將 user_disabled 設置為 1，而不是實際刪除會員
        userModel.softDelete(user_id, (err)=>{
            if (err) {
                console.error('Soft delete error:', err);
            } else {
                res.redirect('/userList');
            }
        })
    },

    // 前端會員登入
    userLogin: async (req, res) => {
        const user_username = req.body.user_name;
        const user_password = req.body.user_password;

        // 檢查欄位是否為空
        if (!user_username || !user_password) {
            return res.status(400).json({ success: false, message: '帳號和密碼不可為空' });
        }

        try {            
            // 驗證帳號密碼
            userModel.getUserData(user_username, (err, userData) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ success: false, message: '伺服器錯誤' });
                }

                if (!userData) {
                    // 登入失敗，用戶不存在
                    return res.status(401).json({ success: false, message: '帳號或密碼錯誤' });
                }

                const hashedPassword = userData.user_password;
                const isPasswordValid = bcrypt.compareSync(user_password, hashedPassword);

                if (!isPasswordValid) {
                    // 登入失敗，密碼不匹配
                    return res.status(401).json({ success: false, message: '帳號或密碼錯誤' });
                }

                // 生成 JWT，使用環境變數中的密鑰
                const token = generateToken(userData);

                // 將 JWT 回傳給前端
                res.status(200).json({ success: true, token, user: userData });
            });
        } catch (error) {
            // 錯誤處理
            res.status(500).json({ success: false, message: '伺服器錯誤' });
        }
    },

    getUserInfo: async (req, res) => {
        try {
          // 從 JWT 中解析使用者 ID
          const userId = req.user.userId;
      
          // 使用 userId 從數據庫中獲取使用者信息
          userModel.getUserById(userId)
            .then(userData => { 
              if (!userData) {
                return res.status(404).json({ success: false, message: '查無使用者' });
              }
      
              // 返回使用者信息
              res.status(200).json({ success: true, user: userData });
            })
            .catch(error => {
              console.error('獲取使用者信息失敗:', error);
      
              if (error instanceof jwt.JsonWebTokenError) {
                console.error('JWT 驗證錯誤:', error.message);
              }
      
              res.status(500).json({ success: false, message: '伺服器錯誤' });
            });
        } catch (error) {
          console.error('獲取使用者信息失敗:', error);
      
          if (error instanceof jwt.JsonWebTokenError) {
            console.error('JWT 驗證錯誤:', error.message);
          }
      
          res.status(500).json({ success: false, message: '伺服器錯誤' });
        }
      },
      

    //前端註冊會員
    userRegister: async (req, res) => {
        const { user_name, user_password, user_email, user_gender, user_birthdate } = req.body;
      
        // 檢查資訊是否完整
        if (!user_name || !user_password || !user_email) {
          return res.status(400).json({ success: false, message: '請提供完整的註冊資訊' });
        }
      
        // 正則表達式驗證
        const usernameRegex = /^[a-zA-Z0-9]{6,12}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
        if (!usernameRegex.test(user_name) || !passwordRegex.test(user_password) || !emailRegex.test(user_email)) {
          return res.status(400).json({ success: false, message: '請提供正確的註冊資訊' });
        }
      
        // 檢查帳號是否已存在
        userModel.checkUsernameExists(user_name, (err, isUsernameExists) => {
          if (err) {
            return res.status(500).json({ success: false, message: err.message });
          }
      
          if (isUsernameExists) {
            return res.status(400).json({ success: false, message: '帳號已存在，請選擇其他帳號' });
          }
      
          bcrypt.hash(user_password, saltRounds, async function (err, hash) {
            if (err) {
              console.error('密碼 hash 失敗:', err);
              return res.status(500).json({ success: false, message: '伺服器錯誤' });
            }
      
            try {
              // 在這裡執行註冊邏輯，將用戶資料存入數據庫
              // hash 後的密碼傳遞給 registerUser 函數
              const userData = await userModel.registerUser(user_name, hash, user_email, user_gender, user_birthdate);
              res.status(201).json({ success: true, message: '註冊成功', user: userData });
            } catch (error) {
              console.error('註冊失敗:', error);
              res.status(500).json({ success: false, message: '伺服器錯誤' });
            }
          });
        });
      },

      //前端修改會員
      FrontendHandleUpdate: (req, res) => {
        // 檢查新密碼是否存在，如果不存在，使用舊密碼
    const newPassword = req.body.user_password !== undefined ? req.body.user_password : req.body.old_user_password;
        console.log('Received PUT request:', req.body);//要刪除

        // 檢查新密碼格式
        //const newPassword = req.body.user_password;
        console.log('New password:', newPassword);//要刪除
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordRegex.test(newPassword)) {
            console.log('新密碼格式不正確')//delete
            return res.status(400).json({ success: false, message: '新密碼格式不正確' });
        }

        // 檢查 Email 格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.user_email)) {
            console.log('email 不正確')//delete
            return res.status(400).json({ success: false, message: 'Email 格式不正確' });
        }

        bcrypt.hash(req.body.user_password, saltRounds, (err, hash) => {
            if (err) return res.status(500).json({ error: 'Hashing error' });    
            console.log('Hashed password:', hash);//delete

            
            // 轉換日期格式
            const user_birthdate = new Date(req.body.user_birthdate).toISOString().split('T')[0];
            const user_updated_at = new Date();

            userModel.FrontendUpdate(
                req.body.user_name,
                hash,
                req.body.user_email,
                req.body.user_gender,
                user_birthdate,
                user_updated_at,
                req.params.id,
                (err, results) => {
                    if (err) {
                        console.log('Error:', err);
                        return res.status(500).json({ error: 'Database error' });
                    } else {
                        // 如果您想返回更新後的使用者資料，可以在此處獲取資料並返回
                        console.log('Update results:', results);//delete
                        userModel.getUserById(req.params.id)
                        .then(user => {                            
                            res.status(200).json({ success: true, message: 'User updated successfully', user });
                        })
                        .catch(err => {
                            console.log('Error getting user by ID:', err);
                            res.status(500).json({ error: 'Database error' });
                        });
                    }
                }
            );
        });
    }
    
}

module.exports = userController;