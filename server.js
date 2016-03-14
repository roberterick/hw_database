console.log("server.js starting");

var express = require('express');
var app = express();
var mysql = require('mysql');
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);
app.use(express.static('public'));

var pool = mysql.createPool({
    host: 'localhost',
    user: 'robert',
    password: 'blue',
    database: 'mysql'
});

var COLUMNS = [{1: 'id', 2: 'name', 3: 'reps', 4: 'weight', 5: 'date (yyyymmdd)', 6: 'lbs'}];

console.log("done performing setup");

app.all('/insert',
    function (req, res, next) {
        console.log('inserting...');
        
        pool.query("INSERT INTO workouts (name,reps,weight,date,lbs) VALUES (?,?,?,?,?)",
        [req.body.name,req.body.reps,req.body.weight,req.body.date,req.body.lbs],    
        
        function (err, result) {
        if (err) {
            next(err);
            return;
        }});
        
        return res.send("");
    }
);

//problem what to render or redirect?
app.all('/delete', function (req, res, next) {
    console.log('inserting...');
    
    pool.query('DELETE FROM workouts WHERE id=(?)',
    [req.body.id],
    
    function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }});
    
    return res.send("");
    }
);

app.all('/getTable', function (req, res, next) {
    pool.query('SELECT * FROM workouts', function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        var data = JSON.stringify(COLUMNS.concat(rows));
        return res.send(data);
    });
});

app.get('/reset-table', function (req, res, next) {
    console.log('resetting the table');
    var context = {};
    pool.query("DROP TABLE IF EXISTS workouts", function (err) {
        var createString = "CREATE TABLE workouts(" +
                "id INT PRIMARY KEY AUTO_INCREMENT," +
                "name VARCHAR(255) NOT NULL," +
                "reps INT," +
                "weight INT," +
                "date DATE," +
                "lbs BOOLEAN)";
        pool.query(createString, function (err) {
            context.results = "Table reset";
            res.render('workouts', context);
        });
    });
});

app.all('/', function (req, res, next) {
    return res.render('workouts');
});

app.use(function (req, res) {
    console.log('returning 404 during request for:' + req.url);
    res.status(404);
    res.render('404');
});

app.use(function (err, req, res, next) {
    console.log('returning 500 during request for:' + req.url);
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
