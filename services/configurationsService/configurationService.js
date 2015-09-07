/**
 * Created by Ciprian on 8/3/15.
 */


var Q = require('q');
var fs= require('fs');
var util = require ('util');


var writeFileAsync = Q.denodeify(fs.writeFile);
var mkdirAsync     = Q.denodeify(fs.mkdir);
var readFileAsync  = Q.denodeify(fs.readFile);
var readDirAsync   = Q.denodeify(fs.readdir);

var config = { isLoaded: false};

function setupConfigurationService(configuration){
    if(configuration === undefined) {
        fs.mkdirSync(__dirname + '/configurations');
    }
    else{
        fs.mkdirSync(__dirname + '/configurations');
    }
    //should be able to customize... we'll go with this for now
}

function persistConfiguration(organization,usage,content) {
    function persist() {
        return fs.writeFileSync(__dirname+'/configurations/' + organization + '/' + organization + '.' + usage + '.conf', content);
    }
    return mkdirAsync(__dirname + '/configurations/' + organization).
        then(persist, persist);
}

function retrieveConfiguration(organization,usage){
    return readFileAsync(__dirname+'/configurations/'+organization+'/'+organization+'.'+usage+'.conf');
}

function retrieveUsages(organization){
    return readDirAsync(__dirname+'/configurations/'+organization).then(function(files){
        var ret = [];
        for(var file = 0 ; file<files.length; file++){
            var x = files[file].split('.');
            ret.push(x[x.length-2]);
        }
        return ret;
    },function(error){
        return [];
    })
}


function isReady(){
    return fs.existsSync(__dirname+'/configurations')
}
exports.isReady              = isReady;

exports.retrieveConfiguration = retrieveConfiguration;

exports.setupConfigService = setupConfigurationService;

exports.persistConfiguration= persistConfiguration;

exports.retrieveUsages = retrieveUsages;

