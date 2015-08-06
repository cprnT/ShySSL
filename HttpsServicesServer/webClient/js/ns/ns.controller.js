/**
 * Created by Ciprian on 7/28/15.
 */


myApp.controller('lookupNameController',['$scope','$rootScope','confServiceFactory',
    function($rootScope,$scope,nameServiceFactory){


        // has a bug: when I get error it does not handle it!!!
        $scope.organization={};
        $scope.addConfiguration = function(){
            function manageResponse(response){
                $scope.organization={};
                alert(response);
            }
            function treatError(){
                $scope.organization={};
            }
            try {
                nameServiceFactory.addConfiguration($scope.organization).
                    success(manageResponse).
                    catch(treatError);
            }
            catch(e){
                alert(e)
            }
        }
    }]);
