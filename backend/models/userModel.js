const db = require('../db');

const userModel = {
    add: (user, cb) =>{
        db.query(
            `INSERT INTO users(user_name, user_password, user_email, user_gender, user_birthdate) values (?, ?, ?, ?, ?)`,
            [
                user.user_name,
                user.user_password,
                user.user_email,
                user.user_gender,
                user.user_birthdate
            ],
            (err, results)=>{
                if(err) return cb(err);
                cb(null);
            }
        )
    },

    getAll:(offset, limit, cb) => {
        db.query(
            `SELECT * FROM users ORDER BY user_created_at DESC LIMIT ?, ?`,
            [offset, limit],
            (err, results) => {
                if(err) return cb(err);
                cb(null, results);
            }
        )
    },
    getCount:(cb)=> {
        db.query(
            `SELECT COUNT(*) AS count FROM users`, (err, results) => 
            {
                if(err) return cb(err);
                const count = results[0].count;
                cb(null, count);
            }
        )
    },
    getUpdate:(user_id, cb)=>{
        db.query(
            `SELECT * FROM users WHERE user_id = ?`,[user_id],
            (err, results) => {
                if(err) return cb (err);
                cb(null, results[0] || {});
            }
        );
    },
    update: (user_name, user_password, user_email, user_gender, user_birthdate, user_updated_at, user_id, cb) => {
        db.query(
            `UPDATE users SET user_name = ?, user_password = ?, user_email = ?, user_gender = ?, user_birthdate = ?, user_updated_at = ? WHERE user_id = ?`,
            [ user_name, user_password, user_email, user_gender, user_birthdate, user_updated_at, user_id ],
            (err, results) => {
                if(err) return cb (err);
                cb(null);
            }
        )
    },
    softDelete: (user_id, cb) => {
        db.query('UPDATE users SET user_disabled = 1 WHERE user_id = ?',
            [user_id],(err, results) => {
                if (err) return cb(err);
                cb(null, results);
            }
        )
    },

    //Function to get data from the database (API)
    getUserData: (username, cb) => {
        db.query(
            'SELECT * FROM users WHERE user_name = ?',
            [username],
            (err, results) => {
                if (err) {
                    return cb({ success: false, message: '伺服器錯誤' });
                }
                if (results.length === 0) {
                    return cb({ success: false, message: '帳號或密碼錯誤' });
                }    
                const user = results[0];
                cb(null, user);
            }
        );
    },

    // getUserData: (username) => {
    //     return new Promise((resolve, reject) => {
    //         db.query(
    //             'SELECT * FROM users WHERE user_name = ?',
    //             [username],
    //             (err, results) => {
    //                 if (err) {
    //                     return reject({ success: false, message: '伺服器錯誤' });
    //                 }
    //                 if (results.length === 0) {
    //                     return reject({ success: false, message: '帳號或密碼錯誤' });
    //                 }
    //                 const user = results[0];
    //                 resolve(user);
    //             }
    //         );
    //     });
    // },
    

    registerUser: (user_name, user_password, user_email, user_gender, user_birthdate) => {
        return new Promise((resolve, reject) => {          
            db.query('INSERT INTO users (user_name, user_password, user_email, user_gender, user_birthdate) VALUES (?, ?, ?, ?, ?)', 
                [user_name, user_password, user_email, user_gender, user_birthdate], (err, result) => {
                if (err) {
                console.error('Database error:', err);
                return reject(err);
                }
        
                // 返回插入後的結果，你可以返回用戶的其他相關資訊
                resolve({
                user_id: result.insertId,
                user_name: user_name,
                user_email: user_email,
                user_gender: user_gender,
                user_birthdate: user_birthdate,
                });
            });
        });
    },

    checkUsernameExists: (user_name, cb) => {
        db.query(
          'SELECT * FROM users WHERE user_name = ?',
          [user_name],
          (err, results) => {
            if (err) {
              return cb({ success: false, message: '伺服器錯誤' });
            }
            // 如果找到了相同的帳號，返回 true，表示已存在
            // 否則返回 false，表示帳號不存在
            return cb(null, results.length > 0);
          }
        );
    },

    // getUserData: () => {
    //     return new Promise((resolve, reject) => {
    //       db.query(`SELECT * FROM users WHERE user_disabled = 0 `, (error, results) => {
    //         if (error) {
    //           reject(error);
    //         } else {
    //           resolve(results);
    //         }
    //       });
    //     });
    //   },
}

module.exports = userModel;