/**
 * Created by Ciprian on 8/3/15.
 */


var certAuthority = require('../services/certificationAuthority/certificationAuthority.js');
var zip      = require('adm-zip');
var fs            = require('fs');

function packKeyAndCertificates(files){
    var zipper = new zip();
    zipper.addLocalFile(files.path+'.key');
    zipper.addLocalFile(files.path+'.cert');
    zipper.addLocalFile(files.issuerCertificate);
    zipper.writeZip(files.path+'.zip');
    return files.path+'.zip';
}
exports.issueCertificate = function(req,res){
    console.log('IssueCertificate for code '+req.params.code);
    certAuthority.generateIdentity(req.params.code).
        then(packKeyAndCertificates,function(error){console.log(error);res.json(error)}).
        then(function(zip){
            console.log('second zipping');
            res.download(zip);
        });
};


exports.fetchIdentity = function (req,res){

    try {
        res.download(certAuthority.fetchKeyAndCertificate(req.params.organization));
    }
    catch(e){
        res.sendStatus(404);
    }
};

exports.setupCertificationAuthority = function(req,res){
    console.log('Setup certification authority\n');
    certAuthority.setupAuthority(req.body).
        then(function(){res.sendStatus(200)},
            function(error){res.json(error);});
};


exports.registerForCertification = function(req,res){
    certAuthority.generateCertificationRequest(req.body).
        then(function(magicCode) {
            console.log(magicCode);
            res.send(magicCode)
        },
            function(error){res.json(error)});
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