require('dotenv').config();
let mysql = require('mysql');
const { DATABASE_HOST, DATABASE_PORT, DATABASE_USER,  DATABASE_PASSWORD, DATABASE } = process.env;

let connection = mysql.createConnection({    
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    user     : DATABASE_USER,
    password : DATABASE_PASSWORD,
    database : DATABASE
});


module.exports = connection;