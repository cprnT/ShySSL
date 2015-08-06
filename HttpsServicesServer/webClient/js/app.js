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
      }).when('/registerForCertification',{
          templateUrl:'partials/certificationAuthority/registerForCertification.html',
          controller :'registerForCertificationController',
          access: {
              requiredLogin: false
          }
      }).when('/getCertification',{
          templateUrl:'partials/certificationAuthority/getCertification.html.html',
          controller :'getCertification',
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

      }).when('/configurations', {
          templateUrl: 'partials/configurationsService/addConfiguration.html',
          controller: 'addConfigurationController',
          access: {
              requiredLogin: false
          }

      }).when('/organizations/:organization',{
        templateUrl:'partials/organizations/organization.html',
          controller:'organizationController',
          access:{
                requiredLogin:false
          }
      }).otherwise({
          redirectTo: '/login'
      }) ;
});


myApp.run(function($rootScope, $window, $http, $location, AuthenticationFactory,UserAuthFactory,nameServiceFactory) {

    $rootScope.loginMessage="Certificates will be displayed after you log in";
    $rootScope.logoutButtonVsibility="visibility:hidden";

    $rootScope.selectedOrganization =$window.sessionStorage.selectedOrganization;

    $rootScope.updateSelectedOrganization = function(org){
        $rootScope.selectedOrganization = org;
        $window.sessionStorage.selectedOrganization = org;
    };
    $rootScope.displayOrganizations = function () {
        //to fetch the certificates see DataFactory!!!... for the moment just hardcode them
        $rootScope.loginMessage="Organizations:";
        nameServiceFactory.retrieveAllNames().then(function(names){
            $rootScope.organizations=names.data;
        })
        };


    $rootScope.logout = function () {
        $rootScope.organizations = [];
        UserAuthFactory.logout();
    };
  // when the page refreshes, check if the user is already logged in and if so reFetch the certificates


  AuthenticationFactory.check();
    if(AuthenticationFactory.isLogged) {
        $rootScope.logoutButtonVsibility="visibility:visible";
        $rootScope.displayOrganizations();
    }

  $rootScope.$on("$routeChangeStart", function(event, nextRoute) {
    if ((nextRoute.access && nextRoute.access.requiredLogin) && !AuthenticationFactory.isLogged) {
      $location.path("/login");
    } else {
      // check if user object exists else fetch it. This is incase of a page refresh
      if (!AuthenticationFactory.user) AuthenticationFactory.user = $window.sessionStorage.user;
      if (!AuthenticationFactory.userRole) AuthenticationFactory.userRole = $window.sessionStorage.userRole;
    }
  });

  $rootScope.$on('$routeChangeSuccess', function() {
    $rootScope.showMenu = AuthenticationFactory.isLogged;
    $rootScope.role = AuthenticationFactory.userRole;
    if(AuthenticationFactory.isLogged) {
        $rootScope.displayOrganizations();
        // if the user is already logged in, take him to the home page
        if ($location.path() == '/login') {
            $location.path('/');
        }
    }
  });
});
