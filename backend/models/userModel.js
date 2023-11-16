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
    // getAll:(cb) => {
    //     db.query(`SELECT * FROM users`,
    //         (err, results) => {
    //             if(err) return cb(err);
    //             cb(null, results);
    //         }
    //     )
    // }

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
    }
}

module.exports = userModel;