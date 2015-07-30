/**
 * Created by Ciprian on 7/28/15.
 */


myApp.controller('lookupNameController',['$scope','$rootScope','nameServiceFactory',
    function($rootScope,$scope,nameServiceFactory){


        // has a bug: when I get error it does not handle it!!!
        $scope.information={};
        $scope.lookup = function(){
            function manageResponse(response){

                $scope.name = response.name;
                delete response.name;
                $scope.response = response;
            }
            function treatError(){
                delete $scope.response;
            }

            try {
                nameServiceFactory.lookup($scope.information.name).
                    success(manageResponse).
                    catch(treatError);
            }
            catch(e){
                alert(e)
            }
        }
    }]);

myApp.controller('registerNameController',['$scope','$rootScope','nameServiceFactory',
    function($rootScope,$scope,nameServiceFactory){
    $scope.organization = {};
    $scope.registerDns = function(){
        function manageResponse(response){
            alert(response);
        }
        function treatError(error){
            alert(error);
        }
        nameServiceFactory.register($scope.organization).
                success(manageResponse).
                error(treatError);
    };
}]);


myApp.controller('setupNameServiceController',['$scope','$rootScope','nameServiceFactory',
    function($rootScope,$scope,nameServiceFactory){

        $scope.nameServiceConfiguration=undefined;
        $scope.setupNameService = function(){

            function manageResponse(response){
                alert('Successful!')
            }
            function treatError(error){
                console.log(error);
            }
        try {
            nameServiceFactory.setupNameService($scope.nameServiceConfiguration).
                success(manageResponse).
                error(treatError);
        }
            catch(e){
                console.log(e);
            }
        }

}]);
