'use strict';

angular.module('powerApp')
  .controller('GardenCtrl', function ($rootScope, $scope, $http, $firebase, Auth, simpleLogin, firebaseRef, syncData) {
  
	$scope.items = syncData('/users/' + $rootScope.auth.user.uid + '/purchased_items/');
	$scope.store_open = false;

  });