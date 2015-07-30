var myApp = angular.module('certificationClient', ['ngRoute']);

myApp.config(function($routeProvider, $httpProvider) {

  $httpProvider.interceptors.push('TokenInterceptor');

  $routeProvider
      .when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'LoginCtrl',
      access: {
        requiredLogin: false
      }
      }).when('/', {
      templateUrl: 'partials/home.html',
      controller: 'homeController',
      access: {
          requiredLogin: true
      }
      }).when('/test', {
          templateUrl: 'partials/test.html',
          controller: 'testController',
          access: {
              requiredLogin: false
          }

      }).when('/certificates/organization/:organization', {
          templateUrl: 'partials/certificationAuthority/certificate.html',
          controller: 'certificateController',
          access: {
              requiredLogin: true
          }
      }).when('/setupCertificationAuthority',{
          templateUrl:'partials/certificationAuthority/setupCertificationAuthority.html',
          controller :'setupCertificationAuthorityController',
          access: {
              requiredLogin: false
          }
      }).when('/certificateOrganization',{
          templateUrl:'partials/certificationAuthority/certificateOrganization.html',
          controller :'setupCertificationAuthorityController',
          access: {
              requiredLogin: false
          }



      }).when('/setupNameService',{
          templateUrl:'partials/nameService/setupNameService.html',
          controller :'setupNameServiceController',
          access: {
              requiredLogin: false
          }
      }).when('/registerName', {
          templateUrl:'partials/nameService/registerName.html',
          controller :'registerNameController',
          access: {
              requiredLogin: false
          }
      }).when('/lookupName',{
          templateUrl:'partials/nameService/lookupName.html',
          controller :'lookupNameController',
          access:{
              requiredLogin:false
          }
      }).otherwise({
          redirectTo: '/login'
      }) ;
});


myApp.run(function($rootScope, $window, $http, $location, AuthenticationFactory,UserAuthFactory,dataFactory) {

    $rootScope.loginMessage="Certificates will be displayed after you log in";
    $rootScope.logoutButtonVsibility="visibility:hidden";
    $rootScope.certificates=[];


    $rootScope.fetchCertificates = function () {
        //to fetch the certificates see DataFactory!!!... for the moment just hardcode them
        $rootScope.loginMessage="Certificates";
        certificates=$rootScope.certificates;
        certificates.push(
            {
                organization: "aaa"
            }
        );
        certificates.push(
            {
                organization: "bbb"
            }
        );
        certificates.push(
            {
                organization: "ccc"
            }
        );
        certificates.push(
            {
                organization: "ddd"
            }
        );
        certificates.push(
            {
                organization: "eee"
            }
        )
    };


    $rootScope.logout = function () {
        UserAuthFactory.logout();
    };
  // when the page refreshes, check if the user is already logged in and if so reFetch the certificates


  AuthenticationFactory.check();
    if(AuthenticationFactory.isLogged) {
        $rootScope.logoutButtonVsibility="visibility:visible";
        $rootScope.fetchCertificates();
    }

  $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
    if ((nextRoute.access && nextRoute.access.requiredLogin) && !AuthenticationFactory.isLogged) {
      $location.path("/login");
    } else {
      // check if user object exists else fetch it. This is incase of a page refresh
      if (!AuthenticationFactory.user) AuthenticationFactory.user = $window.sessionStorage.user;
      if (!AuthenticationFactory.userRole) AuthenticationFactory.userRole = $window.sessionStorage.userRole;
    }
  });

  $rootScope.$on('$routeChangeSuccess', function(event, nextRoute, currentRoute) {
    $rootScope.showMenu = AuthenticationFactory.isLogged;
    $rootScope.role = AuthenticationFactory.userRole;
    // if the user is already logged in, take him to the home page
    if (AuthenticationFactory.isLogged == true && $location.path() == '/login') {
      $location.path('/');
    }
  });
});
