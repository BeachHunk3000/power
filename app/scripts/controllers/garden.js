'use strict';

angular.module('powerApp')
  .controller('GardenCtrl', function ($rootScope, $scope, $http, $firebase, Auth, simpleLogin, firebaseRef, syncData, $window) {
  Auth.setCredentials("3749f5da4f0d427faf9ed00bb616576e", "7bf19829a91144028101feb1740bafb9");
 
	$scope.items = syncData('/users/' + $rootScope.auth.user.uid + '/purchased_items/');
	$scope.store_open = true;
	var LatestValue_url; // = 'https://api.demosteinkjer.no/meters/' + meterID + '/latest?seriesType=ActivePlus';

	function toPoints(oldValue, newValue, oldTimeStamp, newTimeStamp){
		var diffValue = newValue - oldValue;
		var diffTimeStamp = newTimeStamp - oldTimeStamp;
		return (diffTimeStamp/1000) * (diffTimeStamp/(diffValue*50000));
	}
	
	
	$scope.buyItem = function(itemKey, price) {
		var coinsRef = firebaseRef('/users/' + $rootScope.auth.user.uid + '/score');
		var itemsRef = firebaseRef('/users/' + $rootScope.auth.user.uid + '/purchased_items');
		coinsRef.once('value', function(datasnap) {
			if(datasnap.val().coins > price){
				itemsRef.child(itemKey).update({hasItem: true});
				coinsRef.once('value', function(datasnapshot) {
					coinsRef.update({coins: datasnapshot.val().coins-price});
				});
			};
		});
	};

	$scope.fetch = function() {
		LatestValue_url = 'https://api.demosteinkjer.no/meters/' + $rootScope.sensorID + '/latest?seriesType=ActivePlus';
		$http({
			method: 'GET',
			url: LatestValue_url,
			headers: {'Content-type': 'application/json'}
		}).success(function(data, status, headers) {
			var pointsRef = firebaseRef('/users/' + $rootScope.auth.user.uid + '/score')
			pointsRef.once('value', function(points) {
				console.log(points.val());
				var oldValue = points.val().value;
				var oldTimeStamp = points.val().time;
				var oldPoints = points.val().points;
				var oldCoins = points.val().coins;

				var newValue = parseInt(data.meterReadings[0].meterReading.readings[0].value);
				console.log(newValue);
				var newTimeStamp = parseInt(Date.parse(data.meterReadings[0].meterReading.readings[0].timeStamp));

				console.log(oldPoints);
				console.log(oldPoints+toPoints(oldValue, newValue, oldTimeStamp, newTimeStamp));

				pointsRef.set({
					time: newTimeStamp,
					value:  newValue,
					points: oldPoints+toPoints(oldValue, newValue, oldTimeStamp, newTimeStamp),
					coins: oldCoins+toPoints(oldValue, newValue, oldTimeStamp, newTimeStamp)
				});
				var date = new Date(oldTimeStamp);
				$scope.showPopUp(Math.floor(toPoints(oldValue, newValue, oldTimeStamp, newTimeStamp)), date);
			});
		}).error(function(data, status) {
		console.log(data || "Request failed");
		console.log(status);
		});
	};  

	$scope.showPopUp = function(income, date) {
		$scope.pupup = true;
		$scope.$apply(function(){
			$scope.popup_text = "Du har spart strøm siden " + date.getDate() + '.' + (date.getMonth()+1)
			$scope.poeng = income
		});
	}

		//$scope.popup_text = "Du har spart strøm siden " + date.getDate() + "." + (date.getMonth()+1) + 
		//" klokken " + date.getHours() + ":" + date.getMinutes() + "\nBra jobbet!"

	$scope.pupup = false;
  });
