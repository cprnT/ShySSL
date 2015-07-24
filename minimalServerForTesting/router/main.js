/**
 * Created by Ciprian on 7/24/15.
 */
var certAuthority = require("../certificationAuthority/certificationAuthority.js");
var zip      = require('adm-zip');
var fs            = require('fs');
var util        = require('util');
function packFiles(files){
    var zipper = new zip();
    zipper.addLocalFile(files.path+'.key');
    zipper.addLocalFile(files.path+'.cert');
    zipper.addLocalFile(files.issuerCertificate);
    zipper.writeZip(files+'.zip');
    return files+'.zip';
}
module.exports=function(app)
{
    app.get('/autoconfig/:code',function(req,res){

        var code = req.params.code;
        certAuthority.generateIdentity(code).
            then(packFiles).
            then(function(zip){
                console.log('sending:'+zip+'\n');
                res.download(zip);
            }
        );
    });
    app.get('/setup',function(req,res){
        certAuthority.setupAuthority();
    })
};

