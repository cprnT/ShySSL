
/**
 * Created by Ciprian on 8/5/15.
 */


myApp.controller('organizationController',['$scope','$rootScope','$location','configurationServiceFactory',
                'nameServiceFactory','certificationAuthorityFactory',
    function($rootScope,$scope,$location,configurationServiceFactory,nameServiceFactory,certificationAuthorityFactory) {

        $scope.hasConfigurations = false;
        $scope.hasCertificate = false;
        $scope.hasNameInfo = false;
        $scope.nsUnavailable = false;
        $scope.configurationsUnavailable = false;
        $scope.fetchedConfigurations = {};
        $scope.selectedConfiguration={};
        $scope.host = "http://"+$location.host()+':'+$location.port();
        $scope.hasIdentity = false;
        $scope.needsIdentity=false;
        $scope.askForNewUsage=false;
        $scope.readyToEdit   =false;
        $scope.newUsage = {};

        checkIdentity = function(org){
            certificationAuthorityFactory.checkIdentity(org).then(
                function(result){
                        $scope.hasIdentity = true;
                        certificationAuthorityFactory.fetchCodes($rootScope.selectedOrganization).then(function(codes){
                            $scope.magicCode  = codes.data.magicCode;
                        })
                },function(errr){
                    certificationAuthorityFactory.fetchCodes($rootScope.selectedOrganization).
                        then(function(codes){
                            console.log(codes);
                            $scope.directLink = codes.data.directLink;
                            $scope.magicCode  = codes.data.magicCode;
                            $scope.needsIdentity = true;
                        },function(error){
                            alert('an error occured\nsee console for further details');
                            console.log(error);
                        })
                }
            )
        };

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

        seeAvailableConfigurations = function(){

            configurationServiceFactory.retrieveUsages($rootScope.selectedOrganization).then(
                function(result){
                    $scope.usages = result.data;
                    $scope.usages.push("+"); //used to add new configurations
                    $scope.hasConfigurations = true;
                    $scope.configurationsUnavailable=false;
                },
                function(error){
                    $scope.usages = [];
                    $scope.usages.push("+"); //used to add new configurations
                    $scope.configurationsUnavailable=true;
                }
            )
        };

        $scope.fetchIdentity      = function(){
            certificationAuthorityFactory.fetchIdentity($rootScope.selectedOrganization).then(
                function(response){},
                function(error){console.log(error);}
            )
        };

        checkIdentity($rootScope.selectedOrganization);
        seeAvailableConfigurations();

        $scope.askNameService();


        $scope.editConfiguration = function(usage){
            $scope.readyToEdit = true;
            if(usage === '+'){
                $scope.askForNewUsage = true;
                $scope.selectedConfiguration.content = "{}";
                $scope.newUsage.content="";
                $scope.selectedUsage=undefined;
                return;
            }else{
                $scope.askForNewUsage = false;
                $scope.selectedUsage = usage;
                $scope.newUsage.content = undefined;
            }


            if($scope.selectedConfiguration === $scope.fetchedConfigurations[$scope.selectedUsage]){
                //if you selected the same configuration
                $scope.selectedConfiguration.content = undefined;
                $scope.readyToEdit = false;
                $scope.selectedUsage = undefined;
                return;
            }

            if($scope.fetchedConfigurations[usage]){
                //if you already fetched the selected configuration don't fetch it again
                $scope.selectedConfiguration.content = JSON.stringify(
                    $scope.fetchedConfigurations[$scope.selectedUsage],undefined,4
                );
                $scope.readyToEdit = true;

                return;
            }
            configurationServiceFactory.retrieveConfiguration($rootScope.selectedOrganization,usage).
                then(function(result){
                    $scope.fetchedConfigurations[$scope.selectedUsage] = result.data;
                    $scope.selectedConfiguration.content = JSON.stringify($scope.fetchedConfigurations[usage],undefined,4);
                },function(error){
                    alert('Could not retrieve the selected configuration');
                }
            )
        };

        $scope.updateConfiguration = function(){

            if(!$scope.selectedUsage && $scope.newUsage.content === ""){
                $scope.noUsage = true;
                return;
            }else{
                $scope.noUsage = false;
                if($scope.newUsage.content !== undefined){
                    $scope.selectedUsage = $scope.newUsage.content;
                    $scope.newUsage.content = "";
                }
            }

            var newConfiguration = undefined;
            try{
                newConfiguration = JSON.parse($scope.selectedConfiguration.content);
            }catch(e){
                $scope.invalidJson = true;
                console.log(e);
                return;
            }

            $scope.invalidJson = false;
            var updateNeccesary = true;

            if(!$scope.askForNewUsage){
                if($scope.fetchedConfigurations[$scope.selectedUsage] === newConfiguration){
                    updateNeccesary = false;
                }else{
                    $scope.fetchedConfigurations[$scope.selectedUsage] = newConfiguration;
                }
            }

            if(updateNeccesary){
                configurationServiceFactory.addNewConfiguration(
                    $rootScope.selectedOrganization,
                    $scope.selectedUsage,
                    newConfiguration
                ).then(function(response){
                        if($scope.askForNewUsage){
                            $scope.usages.unshift($scope.selectedUsage);
                        }
                        $scope.fetchedConfigurations[$scope.selectedUsage]=newConfiguration;

                    },function(error){
                        alert('an error occured when communicating with the server');
                    })
            }

        };


    }]);