const db = require('../db');

const EventModel = {

  getAll: (cb) =>{
    db.query(
      `SELECT * FROM events`,
      (err, results) => {
        if(err) return cb (err);
        cb(null, results);
      }
    );
  },
}

module.exports = EventModel;