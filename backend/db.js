let mysql = require('mysql');
let connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user     : 'cuckoo',
    password : 'Recount-Dodgy-Composer2',
    database : 'homographs'
});


module.exports = connection;