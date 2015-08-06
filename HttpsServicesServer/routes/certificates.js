/**
 * Created by Ciprian on 8/3/15.
 */


var certAuthority = require('./certificationAuthority/certificationAuthority.js');
var zip      = require('adm-zip');
var fs            = require('fs');

function packKeyAndCertificates(files){
    var zipper = new zip();
    zipper.addLocalFile(files+'.key');
    zipper.addLocalFile(files.path+'.cert');
    zipper.addLocalFile(files.issuerCertificate);
    zipper.writeZip(files+'.zip');
    return files+'.zip';
};

exports.issueCertificate = function(req,res){

    certAuthority.generateIdentity(req,params.code).
        then(packKeyAndCertificates,function(error){res.json(error)}).
        then(function(zip){
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
