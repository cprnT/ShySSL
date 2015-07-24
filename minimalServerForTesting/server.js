/**
 * Created by Ciprian on 7/24/15.
 */



var express=require('express');
var app=express();
require('./router/main')(app);
var server=app.listen(3000,function(){
    console.log("We have started our server on port 3000");
});

