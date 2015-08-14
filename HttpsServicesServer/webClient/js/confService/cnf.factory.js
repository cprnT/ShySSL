/**
 * Created by Ciprian on 3/8/15.
 */

myApp.factory('configurationServiceFactory',function($rootScope,$location,$http){
    return{
        setupConfigurationService:function(configuration){

            function validateConfiguration(configuration){
                return true;
            }

            if(validateConfiguration(configuration)){
                return $http.post('http://'+$location.host()+':'+$location.port()+'/setupConfigurationService',configuration);
            }
            else{
                throw 'Invalid configuration'
            }

        },
        addNewConfiguration:function(confiouration){


            function jsonify(str) {
                try {
                    JSON.parse(str);
                } catch (e) {
                    return false;
                }
                return true;
            }

            function validateOrganization(confiouration){
                return jsonify(confiouration.content);
            }

            if(validateOrganization(confiouration)){
                return $http.post('http://'+$location.host()+':'+$location.port()+'/configure',confiouration);
            }
            else{
                throw 'Invalid data '
            }
        },

        retrieveUsages:function(organizationName){
            if(organizationName !== "") {
                return $http.get('http://'+$location.host()+':'+$location.port()+'/retrieveUsages/' + organizationName);
            }
        },

        retrieveConfiguration:function(organizationName,usage){
            return $http.get('http://'+$location.host()+':'+$location.port()+'/retrieveConfiguration/'+organizationName+'/'+usage);
        }
    }
});