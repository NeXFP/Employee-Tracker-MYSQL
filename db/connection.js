const mysql = require('mysql2')
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'GojoKun10!',
    database: 'employee_db'
});

module.exports = db;