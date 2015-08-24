/**
 * Created by Ciprian on 8/3/15.
 */


var certAuthority = require('../services/certificationAuthority/certificationAuthority.js');
var fs            = require('fs');

exports.issueCertificate = function(req,res){
    console.log('IssueCertificate for code '+req.params.code);
    certAuthority.generateIdentity(req.params.code).
        then(certAuthority.fetchIdentity,
        function(error){console.log(error);res.json(error)}).
        then(function(zip){
            res.download(zip);
        }).catch(function(e){
            console.log(e);
        })
};

exports.fetchIdentity = function (req,res){

    try {
        res.download(certAuthority.fetchIdentity(req.params.organization));
    }
    catch(e){
        res.sendStatus(404);
    }
};

exports.fetchCodes = function(req,res){
    certAuthority.fetchCodes(req.params.organization).then(function(codes){
        res.json(codes);
    },function(error){
        console.log(error);
        res.sendStatus(404);
    });
};

exports.setupCertificationAuthority = function(req,res){
    console.log('Setup certification authority\n');
    certAuthority.setupAuthority(req.body).
        then(function(){res.sendStatus(200)},
            function(error){res.json(error);});
};


exports.registerForCertification = function(req,res){
    certAuthority.generateCertificationRequest(req.body).
        then(function() {
            res.sendStatus(200);
        },
            function(error){
                console.log(error);
                res.sendStatus(404);});
};

exports.isReady = function(){
    return certAuthority.isReady();
};
exports.hasIdentity = function(req,res){
    if(certAuthority.hasIdentity(req.params.organization)){
        res.sendStatus(200);
    }else{
        res.sendStatus(404);
    }
};