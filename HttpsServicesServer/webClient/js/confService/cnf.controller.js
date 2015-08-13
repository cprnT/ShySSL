/**
 * Created by Ciprian on 8/3/15.
 */


myApp.controller('addConfigurationController',['$scope','$rootScope','configurationServiceFactory',
    function($rootScope,$scope,configurationServiceFactory) {
        $scope.usages = [];
        $scope.configuration = {};
        $scope.getUsages = function () {
            if ($scope.configuration.organization.name !== "") {
                configurationServiceFactory.retrieveUsages($scope.configuration.organization).then(function (retrievedUsages) {
                    $scope.usages = retrievedUsages.data;
                })
            }
        };

        $scope.newUsage = false;
        $scope.showNewUsage = function () {
            $scope.newUsage = true;
            $scope.configuration.content = "";
        };

        $scope.hideNewUsage = function () {
            $scope.newUsage = false;
            $scope.configuration.usage = "";
        };
        $scope.retrieveConfiguration = function () {
            $scope.newUsage = false;
            $scope.configuration.content = "";
            if ($scope.configuration.usage !== "" && $scope.configuration.organization !== "") {
                configurationServiceFactory.retrieveConfiguration($scope.configuration.organization, $scope.configuration.usage).
                    then(
                    function (conf) {
                        $scope.configuration.content = JSON.stringify(conf.data);
                    },
                    function (error) {
                        $scope.configuration.content = "";
                    });
            }
        };

        $scope.addNewConfiguration = function () {
            $scope.newUsage = false;
            try {
                configurationServiceFactory.addNewConfiguration($scope.configuration).then(
                    function (result) {
                        console.log(result);
                        $scope.submissionSuccess = true;
                        $scope.submissionFailure = false;
                    },
                    function (error) {

                        $scope.submissionSuccess = false;
                        $scope.submissionFailure = true;
                    });
            }
            catch(e){
                console.log(e);
                $scope.submissionSuccess = false;
                $scope.submissionFailure = true;
            }
        };
    }]);


myApp.controller('setupConfigurationServiceController',['$scope','$rootScope','configurationServiceFactory',
    function($scope,$rootScope,configurationServiceFactory){

        $scope.configuration = {};
        $scope.setupConfigurationService = function(){
            function success(){console.log('configuration service installed')}
            function onError(err){
                alert('an error occured\nsee console for further details');
                console.log(err);
            }
            configurationServiceFactory.setupConfigurationService($scope.configuration).then(success,onError);
        }

    }
]);
