const db = require('../db');

const eventModel = {
    add: (event, cb)=> {
        db.query(
            `INSERT INTO events(event_title, event_date, event_location, event_organizer, event_description, event_website, event_publish) values (?, ?, ?, ?, ?, ?, ?)`,
            [
                event.event_title, 
                event.event_date, 
                event.event_location, 
                event.event_organizer, 
                event.event_description, 
                event.event_website,
                event.event_publish
            ],
            (err, results)=>{
                if(err) return cb(err);
                cb(null);
            }
        )
    },

    getAll:(offset, limit, cb)=>{
        db.query(`SELECT * FROM events ORDER BY event_date DESC LIMIT ?, ?`,
            [offset, limit],
            (err, results)=>{
                if (err) return cb(err);
                cb(null, results);
            }
        )
    },
    getCount:(cb)=>{
        db.query(`SELECT COUNT(*) AS count FROM events`,(err, results)=>{
            if(err) return cb(err);
            const count = results[0].count;
            cb(null, count);
        })
    },
    getUpdate:(event_id, cb)=>{
        db.query(
            `SELECT * FROM events WHERE event_id = ?`,[event_id],
            (err, results) => {
              if(err) return cb (err);
              cb(null, results[0] || {});
            }
          );
    },
    update: (event_title, event_date, event_location, event_organizer, event_description, event_website, event_updated_at, event_publish, event_id, cb) => {
        db.query('UPDATE events SET event_title = ?, event_date = ?, event_location = ?, event_organizer = ?, event_description = ?, event_website = ?, event_updated_at = ?, event_publish = ? WHERE event_id = ?',
            [
                event_title, event_date, event_location, event_organizer, event_description, event_website, event_updated_at, event_publish, event_id
            ],
            (err, results) => {
                if(err)return cb(err);
                cb(null);
            }
        )
    },
    
    delete:(event_id, cb) => {
        db.query('DELETE FROM events WHERE event_id = ?', [event_id],
            (err, results) => {
                if (err) return cb(err);
                cb(null);
            }
        )
    }

}

module.exports = eventModel;