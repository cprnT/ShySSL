/**
 * Created by Ciprian on 7/28/15.
 */

myApp.factory('nameServiceFactory',function($rootScope,$location,$http){
    return{
        setupNameService:function(configuration){

            function validateConfiguration(configuration){
                return true;
            }

            if(validateConfiguration(configuration)){
                return $http.post('http://'+$location.host()+':'+$location.port()+'/setupNameService',configuration);
            }
            else{
                throw 'Invalid configuration'
            }

        },

        registerName:function(nameRegistration){
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
                        alert('Invalid JSON format');
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

            if(validateNameRegistration(nameRegistration)){
                return $http.post('http://'+$location.host()+':'+$location.port()+'/registerName',nameRegistration);
            }
            else{
                throw "Invalid name registration"
            }

        },

        lookup:function(name){
            function validateName(name){
                return name !== '';
            }

            if(validateName(name)) {
                return $http.get('http://'+$location.host()+':'+$location.port()+'/lookup/' + name);
            }
            else{
                throw 'Invalid name'
            }

        },

        retrieveAllNames:function(){
            return $http.get('http://'+$location.host()+':'+$location.port()+'/retrieveAllNames');
        }

    }
});