/**
 * Created by root on 7/17/15.
 */

var openSSL = require('openssl-wrapper');
var util = require ('util');
var Q = require ('q');
var fs = require ('fs');


var writeFileAsync = Q.denodeify(fs.writeFile);
var mkdirAsync     = Q.denodeify(fs.mkdir);
var requestUrl     = "localhost:3000/request";
var readFileAsync  = Q.denodeify(fs.readFile);
var authorityConfiguration = {};

function generateIdentity ( code ) {
    loadConfigurationOptions();
    var data = {};
    function fetchDataToGenerateIdentity() {
        getInfo = function () {
            var key           = readFileAsync(authorityConfiguration.fileStructure.keys_dir + '/' + code);
            var configuration = readFileAsync(authorityConfiguration.fileStructure.configs_dir+'/' + code);
            var gotInfo       = Q.all([key,configuration]);
            return gotInfo;
        };

        packInfo = function (informationArray) {
            data.password      = informationArray[0].toString();
            data.configuration = informationArray[1].toString()
        };


        validCode = function () {
            var configExists = fs.exists(authorityConfiguration.fileStructure.configs_dir+'/' + code);
            var keyExists = fs.exists(authorityConfiguration.fileStructure.keys_dir + '/' + code);
            return configExists && keyExists;
        };

        console.log('fetching data...\n');

        if (validCode) {
            return getInfo().
                then(packInfo);
        }
        else {
            return false;
        }
    }

    function createDirectoryForOrganization() {

        extractOrganizationFromConfiguration = function (configuration) {
            var length = configuration.length;
            for (var i = 0; i < length; i++) {
                if ((configuration[i] === 'O') && (configuration[i + 1] === ' ') && (configuration[i + 2] === '=')) {
                    var organization = "";
                    i = i + 4;
                    while (configuration[i] != '\n') {
                        organization += configuration[i++];
                    }
                    return organization;
                }
            }
            return false;
        };

        console.log('creating directory\n');

        data.organization = extractOrganizationFromConfiguration(data.configuration);

        return mkdirAsync(authorityConfiguration.fileStructure.new_certs_dir+ "/" + data.organization);

    }

    function generatePrivateKey() {
        console.log('generating private key\n');
        return openSSL.qExec('genrsa',
            {
                aes128: undefined,
                passout: 'pass:' + data.password,
                2048: false,
                out: authorityConfiguration.fileStructure.new_certs_dir+'/'+ data.organization + '/' + data.organization + '.key'
            });
    }

    function generateCertificationRequest() {

        console.log('generating certification request\n');
        return openSSL.qExec('req',
            {
                key: authorityConfiguration.fileStructure.new_certs_dir+'/'+ data.organization + '/' + data.organization + '.key',
                new: undefined,
                passin: 'pass:' + data.password,
                out: authorityConfiguration.fileStructure.new_certs_dir+'/'+ data.organization + '/' + data.organization + '.csr',
                config: __dirname + '/pendingRequests/configs/' + code
            });
    }

    function issueCertificate(){

        console.log('issuing certificate\n');
        return openSSL.qExec(
            'ca',
            {
                in:     authorityConfiguration.fileStructure.new_certs_dir+'/'+data.organization+'/'+data.organization+'.csr',
                out:    authorityConfiguration.fileStructure.new_certs_dir+'/'+data.organization+'/'+data.organization+'.cert',
                config: authorityConfiguration.confFile,
                batch : undefined
            });
    }

    function checkCertificate(err) {
        //dummy
        console.log('checking certificate...\n'+err+'\n');
        return true;
    }

    function treatErrors(error){
        //also kind of dummy

        console.log('An error occured during identity generation:\n'+error);
    }

    function deleteUnnecessaryInformation(certificateIsOK){
        if(certificateIsOK){
            console.log('delete unneccesary information\n');
        }
        else{
            console.log('something got wrong\n');
        }
    }
    function returnPaths(){
        return {
            path              : authorityConfiguration.fileStructure.new_certs_dir+'/'+data.organization+'/'+data.organization,
            issuerCertificate : authorityConfiguration.fileStructure.certificate
        }
    }
    return fetchDataToGenerateIdentity().
        then(createDirectoryForOrganization).
        then(generatePrivateKey).
        then(generateCertificationRequest).
        then(issueCertificate).
        then(undefined,checkCertificate).
        then(deleteUnnecessaryInformation).
        then(returnPaths).
        catch(treatErrors);
}

function generatePendingRequest(organizationInformation) {
    loadConfigurationOptions();
    var i = 0;
    function hasRequiredFields(organizationInformation) {
        var requiredFields =['O'];
        for(var i= 0; i<requiredFields.length;i++) {
            if (!organizationInformation.hasOwnProperty(requiredFields[i])) {
                console.log("Insuficient information");
                return false;
            }
        }
        return true;
    }

    function generateSecrets(){
        console.log(i++ +'\n');

        function generateRandomBytes(bytes) {

            return openSSL.qExec('rand', {
                base64: bytes
            });
        }

        var genKey          = generateRandomBytes(10);
        var genCode         = generateRandomBytes(10);
        return Q.all([genCode,genKey]);
    }

    function persistOrganizationInformation() {


        generateConfigFile = function () {

            generateContent = function () {

                isForConfiguration = function (field) {
                    var configFields = ["CN", "emailAddress", "O", "L", "C"];
                    for (var i = 0; i < configFields.length; i++) {
                        if (configFields[i] === field) {
                            return true;
                        }
                    }
                    return false;
                };

                var configTemplate = "[req]" +
                    "\nprompt = no" +
                    "\ndistinguished_name = distinguished_name" +
                    "\n[distinguished_name]" +
                    "\n";

                for (var field in organizationInformation) {
                    if (isForConfiguration(field)) {
                        configTemplate += field + " = " + organizationInformation[field] + "\n";
                    }
                }
                return configTemplate;
            };
            console.log('Conf structure:'+util.inspect(authorityConfiguration));
            return fs.writeFileSync(authorityConfiguration.fileStructure.configs_dir+'/' + organizationInformation.code, generateContent(organizationInformation));
        };

        generateKeyFile = function () {
            return fs.writeFileSync(authorityConfiguration.fileStructure.keys_dir+'/'+organizationInformation.code,organizationInformation.key);
        };

        return Q.all([generateConfigFile(),generateKeyFile()]);
    }

    function attachSecrets(secrets){
        console.log(i++ +'\n');

        organizationInformation.code   = secrets[0].toString('base64');
        organizationInformation.key    = secrets[1].toString('base64');
    }

    function attachMagicCode(){
        console.log(i++ +'\n');

        organizationInformation.magicCode = (new Buffer(requestUrl+" "+organizationInformation.code+" "+organizationInformation.key)).toString('base64');
    }

    function treatErrors(error){
        console.log(error+'\n');
    }

    if(hasRequiredFields(organizationInformation)) {
        return generateSecrets().
            then(attachSecrets).
            then(attachMagicCode).
            then(persistOrganizationInformation).
            then(function(){return organizationInformation.code}).   //to use it in identityGeneration
            catch(treatErrors);
    }
    else{
        return false;
    }
}

function setDesiredConfiguration(customConfiguration){
    function defaultConfiguration(){

        var defaultPolicy = {
            countryName: 'optional',
            stateOrProvinceName: 'optional',
            organizationName: 'supplied',
            organizationalUnitName: 'optional',
            commonName: 'optional',
            emailAddress: 'optional'
        };

        var defaultFileStructure = {
            rootDir      :__dirname,
            database     :'$rootDir/public/certificateIndex',
            new_certs_dir:'$rootDir/issuedCertificates',
            certificate  :'$rootDir/private/ca.cert',
            serial       :'$rootDir/public/serial',
            private_key  :'$rootDir/private/caPrivateKey.pem',
            RANDFILE     :'$rootDir/private/random.txt',
            configs_dir  :'$rootDir/pendingRequests/configs',
            keys_dir     :'$rootDir/pendingRequests/keys'
        };

        var defaultOptions = {
            default_days :365,
            default_crl_days:30,
            default_md   :'md5',
            email_in_dn  :'no',
            name_opt     :'ca_default',
            cert_opt     :'ca_default',
            copy_extensions:'none'
        };

        var configDefaultFile = defaultFileStructure.rootDir+'/config';

        return {
            default_ca   :'CA_default',
            fileStructure:defaultFileStructure,
            otherOptions :defaultOptions,
            policy       :defaultPolicy,
            confFile     :configDefaultFile
        };
    }

    if(customConfiguration === undefined){
        authorityConfiguration = defaultConfiguration();
    }
    else{
        authorityConfiguration = defaultConfiguration();// to be improved!
    }
}
function absolutizeFileStructure(){
    var fileStructure = authorityConfiguration.fileStructure;
    if(!fileStructure.hasOwnProperty('rootDir')){
        return ; //paths can't be relative so they are already absolute
    }
    for(var file in fileStructure){
        if(fileStructure[file][0] === '$'){
            fileStructure[file] = fileStructure.rootDir+fileStructure[file].slice(fileStructure[file].indexOf('/'));
            continue;
        }
        fileStructure[file] = fileStructure[file];
    }
}

function setupAuthority(customConfiguration){
    console.log('Setup authority\n');
    function createConfigurationFile(){
        function generateContent(){
            var content = '[ca]\ndefault_ca = '+authorityConfiguration.default_ca+'\n\n'+'[ '+authorityConfiguration.default_ca+' ]\n\n';

            function insertField(object_field){
                for (var property in object_field){
                    if(object_field.hasOwnProperty(property)) {
                        content += property + ' = ' + object_field[property]+'\n';
                    }
                }
            }
            insertField(authorityConfiguration.fileStructure);
            insertField(authorityConfiguration.otherOptions);
            content+='policy = the_policy\n[ the_policy ]\n';
            insertField(authorityConfiguration.policy);
            return content;
        }
        return writeFileAsync(authorityConfiguration.confFile,generateContent());
    }

    function createDirectoriesForFileStructure(){

        function dropFilesFromPaths(fileStructure){
            var newFileStructure = {};
            for(var field in fileStructure){
                if(fileStructure.hasOwnProperty(field)){
                    if((field.search('dir')>-1)||(field.search('Dir')>-1)){
                        newFileStructure[field] = fileStructure[field];
                    }
                    else{
                        newFileStructure[field] = fileStructure[field].substr(0,fileStructure[field].lastIndexOf('/'));
                    }
                }
            }
            return newFileStructure;
        }

        function promiseToCreateAllPaths() {

            function createDirectoriesForPath(path) {
                var directories = path.split('/');
                var currentPath = '/';
                var index       = 0;
                function createDirectories() {

                    if (directories.length === index) {
                        return ;
                    }
                    if (currentPath !== '/') {
                        currentPath += '/';
                    }
                    currentPath += directories[index++];
                    var startMakingDirectories = mkdirAsync(currentPath);
                    return startMakingDirectories.then(createDirectories,createDirectories);
                }
                return createDirectories();
            }

            var promises = [];
            for (var path in fileStructure) {
                promises.push(createDirectoriesForPath(fileStructure[path]));
            }

            return Q.all(promises);
        }

        var fileStructure = dropFilesFromPaths(authorityConfiguration.fileStructure);
        return promiseToCreateAllPaths();
    }


    function createNeccessaryFiles(){

        var files = authorityConfiguration.fileStructure;
        var privateKey = openSSL.qExec('genrsa', {
            out: files['private_key'],
            2048:false
        });
        var database   = writeFileAsync(files.database,"");
        var serial     = writeFileAsync(files.serial,"100001");
        var RANDFILE   = writeFileAsync(files.RANDFILE,"");
        function genCertificate() {
            function removeTemp(){
                return (Q.denodeify(fs.unlink))(__dirname+'/ownConfig.cnf.tmp');
            }
            return certificate = openSSL.qExec('req', {
                new: undefined,
                x509: undefined,
                days: 3652,
                key: files.private_key,
                config: __dirname + '/ownConfig.cnf.tmp',
                out: files.certificate
            }).then(removeTemp);
        }
        var content =  "[req]\nprompt=no\ndistinguished_name = distinguished_name\n[distinguished_name]\nO = " + require('os').hostname();
        var ownConfig = writeFileAsync(__dirname+'/ownConfig.cnf.tmp',content);
        return Q.all([database,serial,RANDFILE,Q.all([privateKey,ownConfig]).then(genCertificate)]);
    }

    function createSomePendingRequests(){
        var r1 = generatePendingRequest({
            O:'Google'
        });
        var r2 = generatePendingRequest({
            O:'Facebook'
        });
        var r3 = generatePendingRequest({
            O:'Apple'
        });
        var r4 = generatePendingRequest({
            O:'Microsoft'
        });
        var r5 = generatePendingRequest({
            O:'HP'
        });
        var r6 = generatePendingRequest({
            O:'Wikipedia'
        });
        return Q.all([r1,r2,r3,r4,r5,r6]);
    }
    setDesiredConfiguration();
    return createConfigurationFile().
        then(absolutizeFileStructure).
        then(createDirectoriesForFileStructure).
        then(createNeccessaryFiles).
        then(createSomePendingRequests).    //for tests
        catch(function(error){
            console.log('Error:\n'+util.inspect(error));//to be treated
        });
}

function loadConfigurationOptions(){
    //shuld be read from config file...we'll do it this way for now though
    setDesiredConfiguration();
    absolutizeFileStructure()
}

exports.generateIdentity              = generateIdentity;
exports.setupAuthority                = setupAuthority;
exports.generateCertificationRequest  = generatePendingRequest;
