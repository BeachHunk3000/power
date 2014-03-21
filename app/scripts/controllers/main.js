'use strict';

angular.module('powerApp')
  .controller('MainCtrl', function ($scope, $http, $firebase, Auth) {
	$scope.method = 'GET';
	$scope.url = 'https://api.demosteinkjer.no/meters/0e6e348bfdb74432b6709526527c3d12/latest?seriesType=ActivePlus';

    Auth.setCredentials("3749f5da4f0d427faf9ed00bb616576e", "7bf19829a91144028101feb1740bafb9");

	$scope.fetch = function() {
		//$scope.code = null;
		//$scope.response = null;

		//$http({method: 'GET', url: 'www.google.com/someapi', headers: {'Authorization': 'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=='}});
		console.log("get");
		$http({method: $scope.method,
			url: $scope.url,
			headers: {'Content-type': 'application/json'}})
			.success(function(data, status) {
				console.log(data);
				console.log(status)
			})
			.error(function(data, status) {
				console.log(data || "Request failed");
				console.log(status);
			});
	};
  });
