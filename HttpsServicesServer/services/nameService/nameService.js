/**
 * Created by Ciprian on 7/27/15.
 */

var fs = require('fs');
var Q  = require('q');
var util = require('util');
var writeFileAsync = Q.denodeify(fs.writeFile);
var mkdirAsync     = Q.denodeify(fs.mkdir);
var readFileAsync  = Q.denodeify(fs.readFile);
var readDirAsync   = Q.denodeify(fs.readdir);
var serviceConfiguration  = {
    isLoaded : false
};

function setup(){
    var configuration = defaultConfiguration();

    function defaultConfiguration(){
        var conf = {};
        conf.storage = {};
        conf.storage.mode = 'file';
        conf.storage.location = __dirname+'/storage';
        conf.storage.setup = function(){return mkdirAsync(conf.storage.location)};
        conf.path = __dirname+'/config.cnf';
        return conf;
    }

    function persistConfigurationOptions(){
        delete configuration.setup;  //remove unneccesary field
        return writeFileAsync(configuration.path,JSON.stringify(configuration));
    }

    function returnPathToConfig(){
        return configuration.path;
    }

    return configuration.storage.setup().
        then(persistConfigurationOptions).
        then(returnPathToConfig);
}

function loadService(path){
    function setConfiguration(conf){
        serviceConfiguration          = conf;
        serviceConfiguration.isLoaded = true;
    }
    function loadConfiguration(path) {
        function extractConfFromBuffer(configBuffer) {
            return JSON.parse(configBuffer.toString());
        }
        return extractConfFromBuffer(fs.readFileSync(path));
    }

    setConfiguration(loadConfiguration(path));
}


function registerOrganization(organizationInformation){
    if(!fs.existsSync(__dirname+'/config.cnf')){
        throw 'Name service unavailable'
    }
    if(!serviceConfiguration.isLoaded)
        loadService(__dirname+'/config.cnf');

    function extractInformationToBePersisted(organizationInformation){
        return JSON.stringify(organizationInformation);
    }

    function extractPersistenceOptions(storageConfiguration,organizationInformation){
        switch (storageConfiguration.mode){
            case 'file' : {
                if(!organizationInformation.hasOwnProperty('name')){
                    throw 'Service needs the organization name to register'
                }
                return {
                    organizationName:organizationInformation.name
                }
            }
            case 'Redis':{
                throw 'Redis persistence not yet implemented';
            }
            case 'MySQL':{
                throw 'MySQL persistence not yet implemented';
            }
        }
    }


    function persistInformation(storageConfiguration, storageOptions, informationToBePersisted){
        switch(storageConfiguration.mode) {
            case'file':{
                var dir = storageConfiguration.location+'/'+storageOptions.organizationName;
                var dns = storageConfiguration.location+ '/'+storageOptions.organizationName+ '/'+storageOptions.organizationName+'.ns';
                return mkdirAsync(dir).then(function(){return writeFileAsync(dns, informationToBePersisted)});
            }

            case 'Redis':{
                throw 'Redis persistence not yet implemented';
            }
            case 'MySQL':{
                throw 'MySQL persistence not yet implemented';
            }
        }
    }
    return persistInformation(  serviceConfiguration.storage,
                                extractPersistenceOptions(serviceConfiguration.storage,organizationInformation),
                                extractInformationToBePersisted(organizationInformation));
}

function lookUp(organization){
    if(!serviceConfiguration.isLoaded){
        loadService(__dirname+'/config.cnf');
    }
    return readFileAsync(serviceConfiguration.storage.location+'/'+organization+'/'+organization+'.ns').
            then(function(organizationString){return JSON.parse(organizationString)});
}

function retrieveAllNames(){
    if(!serviceConfiguration.isLoaded){
        loadService(__dirname+'/config.cnf');
    }
    return readDirAsync(__dirname+'/storage');
}


exports.lookup               = lookUp;
exports.registerOrganization = registerOrganization;
exports.setup                = setup;
exports.retrieveAllNames     = retrieveAllNames;

