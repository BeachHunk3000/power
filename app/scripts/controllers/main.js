'use strict';

angular.module('powerApp')
  .controller('MainCtrl', function ($scope, $http, $firebase) {
    $http.get('/api/awesomeThings').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $scope.items = $firebase(new Firebase('https://powerhack.firebaseio.com/')));

  });
