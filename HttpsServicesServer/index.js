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




app.all('sensitive/*',[require('./middlewares/validateRequest.js')]);

app.use('/',require('./routes/router.js'));


var webClient = process.argv[2];
if(!webClient){
    webClient = "./webClient";
}
app.use(express.static(webClient));

app.use(function(req,res,next){
   var err = new Error ('Not found');
    err.status = 404;
    next(err);
});


app.set('port',process.env.PORT||3000);
var server=app.listen(app.get('port'),function(){
    console.log("We have started our server on port " + app.get('port'));
});

