/**
 * Created by Ciprian on 7/28/15.
 */

myApp.factory('certificationAuthorityFactory',function($rootScope,$location,$http){
    return{
        registerForCertification:function(organization){

            function validateOrganization(organization){
                return true;
            }

            if(validateOrganization(organization)){
                return $http.post('http://localhost:3000/registerForCertification',organization);
            }
            else{
                throw 'Invalid data for organization'
            }

        },

        getCertificate:function(magicCode){

            function validateNameRegistration(nameRegistration) {

                function jsonifyAdditionalInformation(str) {
                    var addInfo = {};
                    try {
                        addInfo = JSON.parse(str);
                        for(var field in addInfo){
                            nameRegistration[field] = addInfo[field];
                        }
                        delete nameRegistration.additionalInfo;
                    } catch (e) {
                        console.log(e);
                        return false;
                    }
                    return true;
                }

                if (nameRegistration.hasOwnProperty('additionalInfo')) {
                    if (!jsonifyAdditionalInformation(nameRegistration.additionalInfo)) {
                        alert('!!!');
                        return false;
                    }
                }

                if(!nameRegistration.hasOwnProperty('name')){
                    return false;
                }

                else{
                    if(nameRegistration.name === ""){
                        return false;
                    }
                }
                return true;
            }

            var information = JSON.parse(magicCode.toString('ASCII'));
            if(validateNameRegistration(nameRegistration)){
                return $http.post('http://localhost:3000/registerName',nameRegistration);
            }
            else{
                throw "Invalid name registration"
            }

        },

        setupCertificationAuthority:function(name){
            function validateName(name){
                return name !== '';
            }

            if(validateName(name)) {
                return $http.get('http://localhost:3000/lookup/' + name);
            }
            else{
                throw 'Invalid name'
            }

        },

        fetchIdentity:function(name){
            return $http.get("http://localhost:3000/fetchIdentity/"+name);
        }

    }
});