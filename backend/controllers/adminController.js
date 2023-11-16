const adminModel = require('../models/adminModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const itemsPerPage = 15;

const adminController = {
    login: (req, res) =>{
        res.render('admin/login', { admin_name: req.session.admin_name });
    },

    handleLogin: (req, res, next) =>{
        // 獲取從表單提交的帳號和密碼
        const { admin_name, admin_password } = req.body;

        //檢驗欄位是否空白
        if (!admin_name || !admin_password) {
            req.flash('errorMessage', '欄位不可空白');
            return next();
        }
        adminModel.get(admin_name, (err, admin) => {
            if (err) {
                req.flash('errorMessage', err.toString());
                return next();
            };
            if(!admin){
                req.flash('errorMessage', '使用者不存在');
                return next();
            };
            //檢查雜湊密碼是否正確
            bcrypt.compare(admin_password, admin.admin_password, function(err, isSuccess) {
                if(err || !isSuccess){
                    req.flash('errorMessage', err.toString());
                    // req.flash('errorMessage', '帳號或密碼錯誤');
                    return next();
                };
                req.session.admin_name = admin.admin_name;
                req.session.admin_full_name = admin.admin_full_name;
                res.redirect('/');
            });
        })
               
    },

    add: (req, res) => {
        res.render('admin/add');
    },

    handleAdd: (req, res, next) => {
        const { admin_name, admin_password, admin_full_name, admin_email, admin_permission_level, admin_disabled } = req.body;

        if (!admin_name || !admin_password || !admin_full_name || !admin_email || !admin_permission_level || admin_disabled === undefined) {
            req.flash('errorMessage', '缺少必要欄位');
            return next();
        }
        // 先將 admin_disabled 轉換成布林值
        const isDisabled = admin_disabled === '啟用' ? 0 : 1;

        
        //先做雜湊加密，再寫入資料庫
        bcrypt.hash(admin_password, saltRounds, function (err, hash) {
            if (err) {
                req.flash('errorMessage', err.toString());
                return next();
            }
            adminModel.add({
                admin_name,
                admin_password: hash, // 存儲已雜湊的密碼
                admin_full_name,
                admin_email,
                admin_permission_level,
                admin_disabled
            }, (err) => {
                if (err) {
                    req.flash('errorMessage', err.toString());
                    return next();
                }
                req.session.admin_name = admin_name;
                res.redirect('/list');
            });
        });
    },

    logout: (req, res) => {
        req.session.admin_name = null;
        res.redirect('/');
    },
    
    // getAll: (req, res)=>{
    //     adminModel.getAll((err, results)=>{
    //         if(err){
    //             console.log(err);
    //         }
    //         res.render('admin/list',{
    //             admin: results,
    //             admin_full_name: req.session.admin_full_name,
    //         });
    //     })
    // },

    getAll: (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * itemsPerPage;
        const limit = itemsPerPage;
    
        adminModel.getAll(offset, limit, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Internal Server Error');
            }
            adminModel.getCount((err, count) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Internal Server Error');
                }
                const totalPages = Math.ceil(count / itemsPerPage);
                res.render('admin/list', {
                    admin: results,
                    currentPage: page,
                    totalPages: totalPages,
                });
            });
        });
    },
    

    delete: (req, res)=>{
        const adminID = req.params.id;
        adminModel.delete(adminID, err =>{            
            if (err) {
                console.error('Error deleting admin:', err);
            } 
            res.redirect('/list');
        })
    },

    update:(req, res)=>{        
        adminModel.getUpdate(req.params.id, (err, result)=>{
            res.render('admin/update',{
                admin: result
            });
        });        
    },

    handleUpdate: (req, res) => {
        bcrypt.hash(req.body.admin_password, saltRounds, (err, hash)=>{
            if(err) return cb(err);
            const admin_updated_at = new Date();            
            adminModel.update(                 
                req.body.admin_name, 
                hash, 
                req.body.admin_full_name, 
                req.body.admin_email, 
                req.body.admin_permission_level, 
                req.body.admin_disabled, 
                admin_updated_at,
                req.params.id,
                (err) => {
                    if (err) {
                        console.error('Error:', err);
                    } else {
                        res.redirect('/list');
                    }
          });

       })
        
    },

    search:(req, res)=>{
        const keyword = req.query.keyword;
        adminModel.search(keyword, (err, results)=>{
            if(err){
                console.log('Error:', err);
            }            
            res.render('admin/list',{
                admin: results,
                admin_full_name: req.session.admin_full_name
            })
        })
    },
      
    


};

module.exports = adminController;