/**
 * Created by Ciprian on 7/24/15.
 */
var certAuthority = require('../certificationAuthority/certificationAuthority.js');
var zip      = require('adm-zip');
var fs            = require('fs');
var util        = require('util');


var nameService = require('../nameService/nameService.js');
function packFiles(files){
    var zipper = new zip();
    zipper.addLocalFile(files.path+'.key');
    zipper.addLocalFile(files.path+'.cert');
    zipper.addLocalFile(files.issuerCertificate);
    zipper.writeZip(files+'.zip');
    return files+'.zip';
}

module.exports=function(app) {
    app.get('/autoconfig/:code',function(req,res){

        var code = req.params.code;
        certAuthority.generateIdentity(code).
            then(packFiles,function(error){res.json(error)}).
            then(function(zip){
                res.download(zip);
            }
        );
    });

    app.post('/setupCertificationAuthority',function(req,res){
        console.log('Setup certification authority\n');
        certAuthority.setupAuthority(req.body).
            then(function(){res.sendStatus(200)},function(error){res.json(error);});
    });

    app.post('/registerForCertification',function(req,res){
        certAuthority.generateCertificationRequest(req.body).
            then
            (function(magicCode) {console.log(magicCode);res.send(magicCode)},
            function(error){res.json(error)});
    });


    app.post('/setupNameService',function(req,res){
        console.log('Setup name service\n');
        nameService.setup(req.body).
            then(function(){res.sendStatus(200)});
    });

    app.get('/lookup/:organization',function(req,res) {

        function sendResponse(message){
            res.json(message);
        }
        function sendErrorMessage(){
            res.send("The required information is not available");
        }
        nameService.lookup(req.params.organization).then(sendResponse,sendErrorMessage);
    });

    app.post('/registerName',function(req,res){
        function succesfullRegistration(){
            console.log("Name service registering "+util.inspect(req.body)+"\n");
            res.sendStatus(200);
        }
        function unsuccesfullRegistration(error){
            console.log(util.inspect(error));
            res.json(error);
        }
        nameService.registerOrganization(req.body).
            then(succesfullRegistration,unsuccesfullRegistration);
    });

    app.put('/test',function(req,res){
        console.log(util.inspect(req.body)+'\n');
        console.log('Testpost\n');

        res.status(200).send("All good");
    });
};

