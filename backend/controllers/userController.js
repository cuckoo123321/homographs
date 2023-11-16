const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const itemsPerPage = 30;

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
                return res.status(500).sen('Internal Server Error');
            }
            userModel.getCount((err, count) => {
                if(err){
                    console.log(err);
                    return res.status(500).sen('Internal Server Error');
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
}

module.exports = userController;