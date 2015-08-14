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
                return $http.post('http://'+$location.host()+':'+$location.port()+'/registerForCertification',organization);
            }
            else{
                throw 'Invalid data for organization'
            }

        },


        setupCertificationAuthority:function(configuration){
            function validateConfiguration(name){
                return true;
            }

            if(validateConfiguration(configuration)) {
                return $http.post('http://'+$location.host()+':'+$location.port()+'/setupCertificationAuthority',configuration );
            }
            else{
                throw 'Invalid name'
            }

        },

        checkIdentity:function(organization){
            return $http.get('http://'+$location.host()+':'+$location.port()+'/hasIdentity/'+organization);
        }


    }
});