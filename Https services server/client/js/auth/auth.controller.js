myApp.controller('LoginCtrl', ['$scope','$rootScope', '$window', '$location', 'UserAuthFactory', 'AuthenticationFactory',
  function($scope,$rootScope, $window, $location, UserAuthFactory, AuthenticationFactory) {

    $scope.user = {
    };

    $scope.login = function() {

      var username = $scope.user.username,
        password = $scope.user.password;
      if (username !== undefined && password !== undefined) {
        UserAuthFactory.login(username, password).success(function(data) {
          AuthenticationFactory.isLogged = true;
          AuthenticationFactory.user = data.user.username;
          AuthenticationFactory.userRole = data.user.role;

          $window.sessionStorage.token = data.token;
          $window.sessionStorage.user = data.user.username; // to fetch the user details on refresh
          $window.sessionStorage.userRole = data.user.role; // to fetch the user details on refresh

          $location.path("/");


          $rootScope.logoutButtonVsibility="visibility:visible";
          $rootScope.displayOrganizations();
        }).error(function(status) {
          alert('Oops something went wrong!');
        });
      } else {
        alert('Invalid credentials');
      }

    };

  }
]);
