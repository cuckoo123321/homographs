const db = require('../db');


const adminModel = {
    get: (admin_name, cb) => {
        // 在資料庫中查找帳號
        db.query(
          `SELECT * FROM admins WHERE admin_name = ?`, [admin_name], 
          (err, results) => {
            if (err) {
              console.error('Database error:', err);
              return cb(err);
            }
            if (results.length === 0) {
              return cb(null, null);
            }
            const admin = results[0];
            cb(null, admin);
          }
        )          
    },

    add: (admin, cb) =>{
    db.query(
    `INSERT INTO admins(admin_name, admin_password, admin_full_name, admin_email, admin_permission_level, admin_disabled) values(?, ?, ?, ?, ?, ?)`, 
      [
        admin.admin_name,
        admin.admin_password, 
        admin.admin_full_name, 
        admin.admin_email,         
        admin.admin_permission_level, 
        admin.admin_disabled
      ],
      (err, results)=>{
        if(err) return cb(err);
        cb(null);
      }
    )
  },

  getAll: (cb) =>{
    db.query(
      `SELECT * FROM admins`,
      (err, results) => {
        if(err) return cb (err);
        cb(null, results);
      }
    );
  },

  delete: (admin_id, cb) => {
    db.query('DELETE FROM admins WHERE admin_id = ?', [admin_id], (err, results) => {
      if (err) return cb(err);
      cb(null);
    });
  },

  getUpdate:(admin_id, cb)=>{
    db.query(
      `SELECT * FROM admins WHERE admin_id = ?`,[admin_id],
      (err, results) => {
        if(err) return cb (err);
        cb(null, results[0] || {});
      }
    );
  },
  update: (admin_name, admin_password, admin_full_name, admin_email, admin_permission_level, admin_disabled, admin_updated_at,admin_id, cb) => {
    db.query('UPDATE admins SET admin_name = ?, admin_password = ?, admin_full_name = ?, admin_email = ?, admin_permission_level = ?, admin_disabled = ? , admin_updated_at =? WHERE admin_id = ?', 
        [ admin_name, admin_password, admin_full_name, admin_email, admin_permission_level, admin_disabled, admin_updated_at, admin_id],
        (err, results) => {
            if (err) return cb(err);
            cb(null);
        });
  },
 

// search: (keyword, cb) => {
//     let query = `
//         SELECT *, 
//         CASE 
//             WHEN admin_disabled = 0 THEN '啟用' 
//             WHEN admin_disabled = 1 THEN '停權'
//         END AS admin_disabled_text
//         FROM admins
//         WHERE (admin_name LIKE ? OR admin_full_name LIKE ? OR admin_email LIKE ? OR admin_permission_level LIKE ? OR admin_created_at LIKE ? OR admin_updated_at LIKE ?)
//     `;

//     if (keyword === '啟用') {
//         query += ' AND admin_disabled = 0';
//     } else if (keyword === '停權') {
//         query += ' AND admin_disabled = 1';
//     }

//     db.query(query,
//         [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`],
//         (err, results) => {
//             if (err) return cb(err);
//             cb(null, results);
//         }
//     );
// },
  search:(keyword, cb) => {
    // 使用 SQL 查询进行模糊搜索
    db.query(
      'SELECT * FROM admins WHERE admin_name LIKE ? OR admin_full_name LIKE ? OR admin_email LIKE ? OR admin_permission_level LIKE ? OR admin_created_at LIKE ? OR admin_updated_at LIKE ?',
      [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`],
      (err, results) => {
        if (err) return cb(err);
        cb(null, results);
      }
    );
  },


  filter: (admin_permission_level, cb) =>{
    db.query(
      `SELECT * FROM admins WHERE admin_permission_level = ?`,[admin_permission_level],
      (err, results) => {
        if(err) return cb (err);
        cb(null, results);
      }
    );
  },
}

module.exports = adminModel;