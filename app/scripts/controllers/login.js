'use strict';

angular.module('powerApp')
  .controller('LoginCtrl', function ($scope, simpleLogin, $location) {

    $scope.login = function(service) {
      simpleLogin.login(service, function(err) {
        $scope.err = err? err + '' : $location.path('#/garden');
      });
    };
  });
