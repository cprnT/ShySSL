myApp.controller("HeaderCtrl", ['$scope', '$location', 'UserAuthFactory',
  function($scope, $location, UserAuthFactory) {
    $scope.isActive = function(route) {
      return route === $location.path();
    };
    $scope.logout = function () {
      UserAuthFactory.logout();
    };
  }
]);

myApp.controller("homeController", ['$scope',
  function($scope) {
    $scope.name = "homeController";
  }
]);

myApp.controller("certificateController", ['$scope','$rootScope','$routeParams',
  function($rootScope,$scope,$routeParams) {

    for (var certificate = 0; certificate < certificates.length; certificate++) {
      if(certificates[certificate].organization === $routeParams.organization){
        $scope.currentCertificate = certificates[certificate];
        break;
      }
    }
  }
]);

myApp.controller('testController',['$scope,','$rootScope',
  function(){
    alert('TEST');
  }]);





