/**
 * Created by Ciprian on 7/24/15.
 */



var express=require('express');
var bodyParser = require('body-parser');
var app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var cors = require('express-cors');

app.use(cors({
    allowedOrigins: [
        'localhost:63342'
    ]
}));
require('./router/main')(app);
var server=app.listen(3000,function(){
    console.log("We have started our server on port 3000");
});

