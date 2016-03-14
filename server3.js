var mysql      = require('mysql');
//var connection = mysql.createConnection({
//    host: 'localhost',
//    user: 'robert',
//    password: 'blue',
//    database: 'mysql'
//});

var connection = mysql.createConnection({
    host: 'mydbinstance.cxue6qzymn5s.us-west-2.rds.amazonaws.com',
    user: 'robert',
    password: 'blue',
    database: 'workouts'
});
 
connection.connect();
 
connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;
 
  console.log('The solution is: ', rows[0].solution);
});
 
connection.end();
