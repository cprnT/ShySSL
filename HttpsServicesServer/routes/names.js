/**
 * Created by Ciprian on 8/3/15.
 */

var nameService = require('../services/nameService/nameService.js');
var confService = require('../services/configurationsService/configurationService.js');

exports.setupNameService = function(req,res){
    console.log('Setup name service\n');
    nameService.setup(req.body).
        then(function(){res.sendStatus(200)});
};


exports.lookup = function(req,res){
    function sendResponse(message){
        res.json(message);
    }
    function sendErrorMessage(err){
        res.sendStatus(404);
    }
    nameService.lookup(req.params.name).then(sendResponse,sendErrorMessage);
};

exports.registerName = function(req,res){
    function succesfullRegistration(){
        console.log("Name service registering "+util.inspect(req.body)+"\n");
        res.sendStatus(200);
    }
    function unsuccesfullRegistration(error){
        console.log(util.inspect(error));
        res.json(error);
    }
    function createRelayConfiguration(){
        if(!confService.isReady()){
            confService.setupConfigService();
        }
        var relayConf = {};
        relayConf.usage = "relay";
        relayConf.organization = req.body.name;
        delete req.body.name;
        relayConf.content = JSON.stringify(req.body);
        confService.persistConfiguration(relayConf);
    }

    nameService.registerOrganization(req.body).
        then(createRelayConfiguration).
        then(succesfullRegistration,unsuccesfullRegistration);
};


exports.retrieveAllNames = function(req,res){
    function successfulRetrieval(files){
        res.send(files);
    }
    function unsuccessfulRetrieval(error){
        res.json(error);
    }
    if(nameService.isReady()) {
        nameService.retrieveAllNames().then(successfulRetrieval, unsuccessfulRetrieval);
    }else{
        res.send("Please setup nameService first");
    }
};

exports.isReady = function(){
    return nameService.isReady();
};



