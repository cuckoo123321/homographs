require('dotenv').config();
let mysql = require('mysql');
const { HOST, PORT, DATABASE_USER,  PASSWORD, DATABASE } = process.env;

let connection = mysql.createConnection({    
    host: HOST,
    port: PORT,
    user     : DATABASE_USER,
    password : PASSWORD,
    database : DATABASE
});


module.exports = connection;