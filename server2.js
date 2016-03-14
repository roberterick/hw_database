console.log("server_test.js starting");

var express = require('express');
var app = express();
var mysql = require('mysql');

//var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
//var bodyParser = require('body-parser');
//app.use(bodyParser.urlencoded({extended: false}));
//app.use(bodyParser.json());
//app.engine('handlebars', handlebars.engine);
//app.set('view engine', 'handlebars');

app.set('port', 3000);
app.use(express.static('public'));

//var pool = mysql.createPool({
//    host: 'localhost',
//    user: 'robert',
//    password: 'blue',
//    database: 'mysql'
//});

var pool = mysql.createPool({
    host: 'mydbinstance.cxue6qzymn5s.us-west-2.rds.amazonaws.com',
    user: 'robert',
    password: 'blue',
    database: 'workouts'
});

var COLUMNS = [{1: 'id', 2: 'name', 3: 'reps', 4: 'weight', 5: 'date (yyyymmdd)', 6: 'lbs'}];

console.log("done performing setup");


app.all('/', function (req, res, next) {
    pool.query('SELECT * FROM workouts', function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        var data = JSON.stringify(COLUMNS.concat(rows));
        return res.send(data);
    });
});

var server=app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
server.timeout=300000;
console.log("server timeout:"+server.timeout);

