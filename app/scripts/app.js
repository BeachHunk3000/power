'use strict';

angular.module('powerApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'angularfire.firebase',
  'angularfire.login',
  'firebase',
  'powerApp_base64',
  'powerApp_auth'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        authRequired: true,
        templateUrl: 'partials/garden',
        controller: 'GardenCtrl'
      })
      .when('/main', {
        authRequired: true,
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .when('/login', {
        authRequired: false,
        templateUrl: 'partials/login',
        controller: 'LoginCtrl'
      })
      .otherwise({
        redirectTo: '/garden'
      });
      
    $locationProvider.html5Mode(true);
  });