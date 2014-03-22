'use strict';

angular.module('powerApp')
  .controller('MainCtrl', function ($rootScope, $scope, $http, $firebase, Auth, simpleLogin, firebaseRef) {
  Auth.setCredentials("3749f5da4f0d427faf9ed00bb616576e", "7bf19829a91144028101feb1740bafb9");

    var LatestValue_url; // = 'https://api.demosteinkjer.no/meters/' + meterID + '/latest?seriesType=ActivePlus';
    var url = "https://api.demosteinkjer.no/meters/" + $rootScope.sensorID;
    var apiNumber;

  function toPoints(oldValue, newValue, oldTimeStamp, newTimeStamp){
    var diffValue = newValue - oldValue;
    var diffTimeStamp = newTimeStamp - oldTimeStamp;
    return diffValue * (diffValue/diffTimeStamp);
  }

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
        });
      }).error(function(data, status) {
        console.log(data || "Request failed");
        console.log(status);
      });
	};

  // Anders
  var userRef = firebaseRef("users/");
  $scope.nameArray = [];
  $scope.namepoints = [];
  
  userRef.once("value", function(dataSnapshot){
    
    $scope.$apply(function(){
    var i=0;
      dataSnapshot.forEach(function(childSnapshot) {
        $scope.nameArray[i] = childSnapshot.val();

          if($scope.nameArray[i].userinfo.displayName == $scope.auth.user.name){
            $scope.coins = $scope.nameArray[i].score.coins;
          };
        i++;
      });
    });
 

  $scope.sortedArray = [];
  var storst = $scope.nameArray[0].score.points;

    //for(var k=0; k<3; k++){
      for(var j=0; j<$scope.nameArray.length; j++){
        console.log($scope.nameArray.length);

        console.log("hei dette er først")
        console.log($scope.nameArray);

        $scope.nameArray.splice(j,1);


      
      };
    $scope.sortedArray.push(storst);  
    //}
        



    console.log($scope.nameArray[0].score.points);
  });


        

  $scope.logout = function() {
      simpleLogin.logout(function(err) {
        $scope.err = err? err + '' : null;
      });
    };
  });
