/**
 * Created by Ciprian on 7/24/15.
 */
var certAuthority = require('/home/ctalmacel/Work/NodePKI/minimalServerForTesting/certificationAuthority/certificationAuthority.js');
var zip      = require('adm-zip');
var fs            = require('fs');
var util        = require('util');
function packFiles(files){
    console.log('Zipping\n');
    var zipper = new zip();
    console.log(util.inspect(files)+'\n');
    zipper.addLocalFile(files.path+'.key');
    zipper.addLocalFile(files.path+'.cert');
    zipper.addLocalFile(files.issuerCertificate);
    console.log('Writing to zip...\n');
    zipper.writeZip(files+'.zip');
    console.log('Done zipping\n');
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

