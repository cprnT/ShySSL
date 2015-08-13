/**
 * Created by Ciprian on 8/3/15.
 */


var express = require('express');
var router = express.Router();


var names = require('./names.js');
var certificates = require('./certificates.js');
var configurations= require('./configurations.js');
var authentication = require('./authentication.js');


function setupServer(req,res){
    var nameService = require('../services/nameService/nameService.js');
    var certAuthority = require('../services/certificationAuthority/certificationAuthority.js');
    var confService = require('../services/configurationsService/configurationService.js');

    try {
        nameService.setup(req.body.nameServiceConfiguration);
        certAuthority.setupAuthority(req.body.certificationAuthorityConfiguration);
        confService.setupConfigService(req.body.configurationsServiceConfigurations);
        res.sendStatus(200);
    }
    catch(e){
        res.json(e);
    }
}

function checkServer(req,res){
    var caAvailability = certificates.isReady();
    var nsAvailability = names.isReady();
    var confAvailability = configurations.isReady();

    res.json({
        ca:caAvailability,
        ns:nsAvailability,
        cnf:confAvailability
    })
}

router.get('/setupServer',setupServer);
router.get('/checkServer',checkServer);

router.post('/setupCertificationAuthority',certificates.setupCertificationAuthority);
router.post('/registerForCertification',certificates.registerForCertification);
router.get('/autoconfig/:code',certificates.issueCertificate);
router.get('/fetchIdentity/:organization',certificates.fetchIdentity);
router.get('/hasIdentity/:organization',certificates.hasIdentity);

router.post('/setupNameService',names.setupNameService);
router.post('/registerName',names.registerName);
router.get('/lookup/:name',names.lookup);
router.get('/retrieveAllNames',names.retrieveAllNames);


router.post('/setupConfigurationService',configurations.setupConfigurationService);
router.post('/configure',configurations.persistConfiguration);
router.get('/retrieveConfiguration/:organization/:usage',configurations.retrieveConfiguration);
router.get('/retrieveUsages/:organization',configurations.retrieveUsages);

router.post('/login',authentication.login);



module.exports = router;