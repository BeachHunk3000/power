'use strict';

angular.module('powerApp')
  .controller('MainCtrl', function ($rootScope, $scope, $http, $firebase, Auth, simpleLogin) {
	$scope.method = 'GET';
	$scope.url = 'https://api.demosteinkjer.no/downloads/361';

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

  $scope.logout = function() {
      simpleLogin.logout(function(err) {
        $scope.err = err? err + '' : null;
      });
    };


  });
