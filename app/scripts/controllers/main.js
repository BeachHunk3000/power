'use strict';

angular.module('powerApp')
  .controller('MainCtrl', function ($scope, $http, $firebase) {
    $http.get('/api/awesomeThings').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $scope.items = $firebase(new Firebase('https://powerhack.firebaseio.com/'));

	$scope.testApi = $http({method: 'GET', url: 'https://api.demosteinkjer.no'}).
		success(function(data, status, headers, config) {
		  console.log(data);
		}).
		error(function(data, status, headers, config) {
		  console.log(data);
		});
  });
