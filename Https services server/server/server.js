/**
 * Created by Ciprian on 7/24/15.
 */



var express=require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');

var app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));

/*
var cors = require('express-cors');

app.use(cors({
    allowedOrigins: [
        'localhost:63342'
    ]
}));
*/

app.all('/*', function(req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

app.all('sensitive/*',[require('./middlewares/validateRequest.js')]);

app.use('/',require('./routes/router.js'));

app.use(function(req,res,next){
   var err = new Error ('Not found');
    err.status = 404;
    next(err);
});


app.set('port',process.env.PORT||3000);
var server=app.listen(app.get('port'),function(){
    console.log("We have started our server on port " + app.get('port'));
});

