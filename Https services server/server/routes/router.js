/**
 * Created by Ciprian on 8/3/15.
 */


var express = require('express');
var router = express.Router();


var names = require('./names.js');
var certificates = require('./certificates.js');
var configurations= require('./configurations.js');
var authentication = require('./authentication.js');


router.post('/setupCertificationAuthority',certificates.setupCertificationAuthority);
router.post('/registerForCertification',certificates.registerForCertification);
router.get('/autoconfig/:code',certificates.issueCertificate);
router.get('/fetchIdentity/:organization',certificates.fetchIdentity);

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