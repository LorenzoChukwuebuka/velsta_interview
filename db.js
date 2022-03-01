const mysql =  require('mysql2');

 const db = mysql.createConnection({
    host     :   'localhost', 
    user     :    'root',
    password :    '',
    database :    'velsta_interview'
});


module.exports = db;