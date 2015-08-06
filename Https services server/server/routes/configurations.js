/**
 * Created by Ciprian on 8/3/15.
 */
var configs = require('../services/configurationsService/configurationService.js');

exports.retrieveConfiguration = function (req,res){

    function respond(config){

        res.send(config.toString());
    }
    function treatError(error){
        res.sendStatus(404);
    }
    configs.retrieveConfiguration(req.params.organization,req.params.usage).
        then(respond,treatError);
};


exports.setupConfigurationService = function(req,res){
    configs.setupConfigService(req.body);
    res.sendStatus(404);
};

exports.persistConfiguration = function(req,res){
    function respond(){
        res.sendStatus(200);
    }
    function treatError(error){
        res.send(JSON.stringify(error));
    }
    configs.persistConfiguration(req.body).
        then(respond,treatError);
};

exports.retrieveUsages = function(req,res){
    function respond(usages){

        console.log(JSON.stringify(usages));
        res.send(usages);
    }
    function treatError(error){
        res.sendStatus(404);
    }
    configs.retrieveUsages(req.params.organization).then(respond,treatError);
};