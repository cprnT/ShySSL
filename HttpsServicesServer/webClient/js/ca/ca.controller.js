/**
 * Created by Ciprian on 7/28/15.
 */





myApp.controller('registerForCertificationController',['$scope','certificationAuthorityFactory',function($scope,certificationAuthorityFactory){

    $scope.organization = {};
    $scope.registerForCertification =function(){
        function manageResponse(response){
            alert(response);
        }
        function treatError(error){
            alert(error);
        }

        certificationAuthorityFactory.registerForCertification($scope.organization).
            success(manageResponse).
            error(treatError);
    }
}]);
