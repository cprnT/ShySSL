
/**
 * Created by Ciprian on 8/5/15.
 */


myApp.controller('organizationController',['$scope','$rootScope','configurationServiceFactory',
                'nameServiceFactory','certificationAuthorityFactory',
    function($rootScope,$scope,configurationServiceFactory,nameServiceFactory,certificationAuthorityFactory) {
        $scope.hasConfigurations = false;
        $scope.hasNameInfo = false;
        $scope.hasCertificate = false;
        $scope.nsUnavailable = false;
        $scope.configurationsUnavailable = false;
        $scope.askNameService = function(){
            if($scope.hasNameInfo === true){
                $scope.hasNameInfo = false;
                return;
            }
            nameServiceFactory.lookup($rootScope.selectedOrganization).then(
                function(resp){
                    console.log(resp);
                    $scope.hasNameInfo = true;
                    $scope.nsUnavailable = false;
                    $scope.nameServiceResponse = resp.data;
                },

                function(error){
                    $scope.hasNameInfo = false;
                    $scope.nsUnavailable = true;
                });
        };


        $scope.askForConfigurations = function(){
            if($scope.hasConfigurations){
                $scope.hasConfigurations = false;
                return;
            }

            configurationServiceFactory.retrieveUsages($rootScope.selectedOrganization).then(
                function(result){
                    $scope.fetchedConfiguration={};
                    $scope.configs = {};
                    $scope.usages = result.data;
                    $scope.hasConfigurations = true;
                    $scope.configurationsUnavailable=false;
                },
                function(error){
                    $scope.usages = [];
                    $scope.configs = {};
                    $scope.hasConfigurations=false;
                    $scope.configurationsUnavailable=true;
                }
            )
        };

        $scope.seeConfiguration = function(usage){
            if($scope.fetchedConfiguration[usage]){
                $scope.fetchedConfiguration[usage] = false;
                delete $scope.configs[usage];
                return;
            }
            configurationServiceFactory.retrieveConfiguration($rootScope.selectedOrganization,usage).
                then(function(result){
                    $scope.configs[usage] = result.data;
                    $scope.fetchedConfiguration[usage]=true;
                    console.log($scope.fetchedConfiguration);
                },function(error){
                    $scope.fetchedConfiguration[usage]=false;
                    alert('Fetching failed');
                }
            )
        };

        $scope.fetchIdentity      = function(){
            alert('fetching');
            certificationAuthorityFactory.fetchIdentity($rootScope.selectedOrganization).then(
                function(response){

                },
                function(error){
                    console.log(error);
                }
            )
        }

    }]);