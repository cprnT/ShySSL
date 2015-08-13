
/**
 * Created by Ciprian on 8/5/15.
 */


myApp.controller('organizationController',['$scope','$rootScope','configurationServiceFactory',
                'nameServiceFactory','certificationAuthorityFactory',
    function($rootScope,$scope,configurationServiceFactory,nameServiceFactory,certificationAuthorityFactory) {
        $scope.hasConfigurations = false;
        $scope.hasCertificate = false;
        $scope.hasNameInfo = false;
        $scope.nsUnavailable = false;
        $scope.configurationsUnavailable = false;
        $scope.selectedUsage = undefined;
        $scope.hasSelectedConfiguration = false;
        $scope.selectedConfiguration = {};
        $scope.fetchedConfigurations = {};

        $scope.hasIdentity = false;
        $scope.needsIdentity=false;

        checkIdentity = function(org){
            certificationAuthorityFactory.checkIdentity(org).then(
                function(result){
                        $scope.hasIdentity = true;
                },function(errr){
                    $scope.needsIdentity = true;
                }
            )
        };
        checkIdentity($rootScope.selectedOrganization);

        $scope.askNameService = function(){
            if($scope.hasNameInfo === true){
                $scope.hasNameInfo = false;
                return;
            }
            nameServiceFactory.lookup($rootScope.selectedOrganization).then(
                function(resp){
                    $scope.hasNameInfo = true;
                    $scope.nsUnavailable = false;
                    $scope.nameInformation = resp.data;
                },

                function(error){
                    console.log(error);
                    $scope.hasNameInfo = false;
                    $scope.nsUnavailable = true;
                });
        };


        $scope.askForConfigurations = function(){

            configurationServiceFactory.retrieveUsages($rootScope.selectedOrganization).then(
                function(result){
                    $scope.usages = result.data;
                    $scope.hasConfigurations = true;
                    $scope.configurationsUnavailable=false;
                    console.log(result.data);
                },
                function(error){
                    $scope.usages = [];
                    $scope.configs = {};
                    $scope.hasConfigurations=false;
                    $scope.configurationsUnavailable=true;
                }
            )
        };


        $scope.askForConfigurations();
        $scope.askNameService();

        $scope.seeConfiguration = function(usage){
            $scope.selectedUsage = usage;
            if($scope.selectedConfiguration === $scope.fetchedConfigurations[usage]){
                $scope.selectedConfiguration = undefined;
                $scope.hasSelectedConfiguration = false;
                $scope.selectedUsage = undefined;
                return;
            }

            if($scope.fetchedConfigurations[usage]){
                $scope.selectedConfiguration = $scope.fetchedConfigurations[usage];
                $scope.hasSelectedConfiguration = true;
                return;
            }

            configurationServiceFactory.retrieveConfiguration($rootScope.selectedOrganization,usage).
                then(function(result){
                    $scope.hasSelectedConfiguration = true;
                    $scope.fetchedConfigurations[usage] = result.data;
                    $scope.selectedConfiguration = $scope.fetchedConfigurations[usage];
                },function(error){
                    alert('Could not retrieve the selected configuration');
                }
            )
        };

        $scope.fetchIdentity      = function(){
            certificationAuthorityFactory.fetchIdentity($rootScope.selectedOrganization).then(
                function(response){

                },
                function(error){
                    console.log(error);
                }
            )
        }


    }]);