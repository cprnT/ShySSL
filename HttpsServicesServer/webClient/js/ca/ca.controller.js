/**
 * Created by Ciprian on 7/28/15.
 */





myApp.controller('registerForCertificationController',['$scope','$rootScope','certificationAuthorityFactory',function($scope,$rootScope,certificationAuthorityFactory){

    $scope.organization = {};
    $scope.hasMagicCode = false;
    $scope.registerForCertification =function(){
        function manageResponse(response){
            $scope.magicCode = response;
            $scope.hasMagicCode=true;

        }
        function treatError(error){
            alert('An error occured\nsee the console for further details');
            $scope.hasMagicCode = false;
            console.log(error);
        }

        certificationAuthorityFactory.registerForCertification($scope.organization).
            success(manageResponse).
            error(treatError);
    }



}]);

myApp.controller('setupCertificationAuthorityController',['$scope','certificationAuthorityFactory',
    function($scope,certificationAuthorityFactory){
    $scope.configuration = {};
    $scope.setupCertificationAuthority = function(){
        function success(){
            console.log('Setup authority succesfull');
        }
        function onError(err){
            alert('An error occured\n See console for further details');
            console.log(err);
        }
        certificationAuthorityFactory.setupCertificationAuthority($scope.configuration).then(success,onError);
    }
}]);

myApp.controller('fetchIdentityController',['$scope',
    function($scope){
        $scope.information = {};
    }]);