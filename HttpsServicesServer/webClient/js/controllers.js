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

myApp.controller("homeController", ['$scope','$location','UserAuthFactory','$http','$timeout',
  function($scope,$location,UserAuthFactory,$http,$timeout) {
    $scope.name = "homeController";
    $scope.host = 'http://'+$location.host()+':'+$location.port();
    
    $scope.setupServer = function(){
      $http.get('http://'+$location.host()+':'+$location.port()+'/setupServer').then(
      UserAuthFactory.checkServerAvailability,function(err){
            console.log(err);
            alert('an error appeared\nsee console for further details')
          });
    };
  }
]);

myApp.controller('testController',['$scope,','$rootScope',
  function(){
    alert('TEST');
  }]);





