/**
 * Created by Ciprian on 7/28/15.
 */


myApp.controller('lookupNameController',['$scope','$rootScope','nameServiceFactory',
    function($rootScope,$scope,nameServiceFactory){


        // has a bug: when I get error it does not handle it!!!
        $scope.organization={};
        $scope.lookup = function(){
            function success(response){
                $scope.organization={};
                $scope.response = response.data;

            }
            function onError(){
                $scope.organization={};
            }
            try {
                nameServiceFactory.lookup($scope.organization.name).then(success,onError);
            }
            catch(e){
                alert('Invalid name')
            }
        }
    }]);

myApp.controller('setupNameServiceController',['$scope','nameServiceFactory',function($scope,nameServiceFactory){
    $scope.configuration = {};

    $scope.setupNameService = function(configuration){

        function success(){
            console.log('Setup authority succesfull');
        }
        function onError(err){
            alert('An error occured\n See console for further details');
            console.log(err);
        }
        nameServiceFactory.setupNameService(configuration).then(success,onError);
    }
}]);

myApp.controller('registerNameController',['$scope','$rootScope','$location','nameServiceFactory',"certificationAuthorityFactory",
    function($scope,$rootScope,$location,nameServiceFactory,certificationAuthorityFactory){

    $scope.organization = {};
    $scope.certification ={};
    $scope.getCertification = function(){
        $scope.certification.O = $scope.organization.name;
        $scope.certification.emailAddress = organization.email;
        $rootScope.updateSelectedOrganization($scope.organization.name);
        function manageResponse(){
            $location.path('/organizations/'+$rootScope.selectedOrganization);
        }

        function treatError(error){
            alert('An error occured\nsee the console for further details');
            console.log(error);
        }

        certificationAuthorityFactory.registerForCertification($scope.certification).success(manageResponse).error(treatError);
    };


        $scope.registerName = function(){
            function success(){
                console.log('Name registered');
                $scope.getCertification();
            }
            function onError(err){
                alert('An error occured\n See console for further details');
                console.log(err);
            }
            nameServiceFactory.registerName($scope.organization).success(success).error(onError);
        }





}]);