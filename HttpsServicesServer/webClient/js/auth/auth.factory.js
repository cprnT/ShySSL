myApp.factory('AuthenticationFactory', function($window) {
  var auth = {
    isLogged: false,
    check: function() {
      if ($window.sessionStorage.token && $window.sessionStorage.user) {
        this.isLogged = true;
      } else {
        this.isLogged = false;
        delete this.user;
      }
    }
  };

  return auth;
});

myApp.factory('UserAuthFactory', function($rootScope, $window, $location, $http, AuthenticationFactory) {
  return {
    login: function(username, password) {
      return $http.post('http://'+$location.host()+':'+$location.port()+'/login', {
        username: username,
        password: password
      });
    },
    logout: function() {
      if (AuthenticationFactory.isLogged) {

        AuthenticationFactory.isLogged = false;
        delete AuthenticationFactory.user;
        delete AuthenticationFactory.userRole;

        delete $window.sessionStorage.token;
        delete $window.sessionStorage.user;
        delete $window.sessionStorage.userRole;

        $rootScope.certificates = [];
        $rootScope.loginMessage = "Certificates will be displayed after you log in" ;
        $location.path("/login");
      }
    },
    checkServerAvailability:function(){
      return $http.get('http://'+$location.host()+':'+$location.port()+'/checkServer').success(function(response){
        $rootScope.headBarStyle = "visibility:visible";
        $rootScope.serverInfo.caAvailability = response.ca;
        $rootScope.serverInfo.nsAvailability = response.ns;
        $rootScope.serverInfo.cnfAvailability= response.cnf;
        if($rootScope.serverInfo.nsAvailability){
          $rootScope.displayOrganizations();
        }
      },function(error){
        alert('An error appeared while checking server availability\nSee console for further details')
        console.log(error);
          });

    },
    registerUser:function(user,password){
      return $http.post('http://'+$location.host()+':'+$location.port()+'/registerUser',{
        user:user,
        password:password
      });
    },
    changePassword:function(user,oldPassword,newPassword){
      return $http.post('http://'+$location.host()+':'+$location.port()+'/changePassword',{
        user:user,
        password:oldPassword,
        newPassword:newPassword
      });
    }
  }
});

myApp.factory('TokenInterceptor', function($q, $window) {
  return {
    request: function(config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers['X-Access-Token'] = $window.sessionStorage.token;
        config.headers['X-Key'] = $window.sessionStorage.user;
        config.headers['Content-Type'] = "application/json";
      }
      return config || $q.when(config);
    },

    response: function(response) {
      return response || $q.when(response);
    }
  };
});


