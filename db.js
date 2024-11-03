const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'username',
    password: 'password',
    database: 'dbmsproject',
});

module.exports = db;
