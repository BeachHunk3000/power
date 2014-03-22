'use strict';
angular.module('angularfire.login', ['firebase', 'angularfire.firebase'])
 
  .run(function($rootScope, simpleLogin, firebaseRef) {
    simpleLogin.init();
    $rootScope.$on('$firebaseSimpleLogin:login', function() {
      var userReflol = firebaseRef("users/" + $rootScope.auth.user.uid + "/sensor");
      console.log("HEIASDASD");
      userReflol.once('value', function(dataSnapshot) {
        dataSnapshot.forEach(function(pikk) {
          console.log("HEI");
          $rootScope.sensorID = pikk.val();
        });
      });
    });
  })
 
  .factory('simpleLogin', function($rootScope, $http, $firebaseSimpleLogin, firebaseRef, $timeout, syncData) {
    function assertAuth() {
      if( auth === null ) { throw new Error('Must call loginService.init() before using its methods'); }
    };
 
    function ifNotInDbAddUserToDB(user){ // Legger til brukeren i databasen hvis den ikke er der enda.
      var usersRef = firebaseRef("users");
      var userRef = firebaseRef("users/" + user.uid + '/userinfo/')
      usersRef.once('value', function(dataSnapshot) {
        if(!dataSnapshot.hasChild(user.uid)){
          userRef.set(user)
          addSensor(user.uid);
        };
      });
    };

    function setScoreValues(sensorID) {
      var LatestValue_url = 'https://api.demosteinkjer.no/meters/' + sensorID + '/latest?seriesType=ActivePlus';
      $http({
        method: 'GET',
        url: LatestValue_url,
        headers: {'Content-type': 'application/json'}
      }).success(function(data, status, headers) {
          console.log(data);
          var newValue = parseInt(data.meterReadings[0].meterReading.readings[0].value);
          var newTimeStamp = parseInt(Date.parse(data.meterReadings[0].meterReading.readings[0].timeStamp));
          var userRef = firebaseRef("users/" + $rootScope.auth.user.uid + '/score/');
          userRef.set({
            time: newTimeStamp,
            points: 0,
            value: newValue,
            coins: 100
          });

      }).error(function(data, status) {
        console.log(data || "Request failed");
        console.log(status);
      });
    }

    function addSensor(user_uid) {
      var sensorsRef = firebaseRef("/sensors/");
      var usersRef = firebaseRef("/users/");
      var foundSensor = false;
      sensorsRef.once('value', function(sensors) {
        sensors.forEach(function(sensor) {
          var useThisSensor = true;
          usersRef.once('value', function(users) {
            users.forEach(function(user) {
                var myUserRef = firebaseRef('/users/' + user_uid);
                myUserRef.once('value', function(dsn) {
                  if(!dsn.hasChild('sensor')){
                    myUserRef.child('sensor').set({key: sensor.val()});
                    setScoreValues(sensor.val());
                  }
                })
            });
          });
        });
      });
    };
   
    var auth = null;
    return {
      init: function() {
        auth = $firebaseSimpleLogin(firebaseRef());
        $rootScope.auth = auth;
        return auth;
      },
 
      logout: function() {
        assertAuth();
        auth.$logout();
      },
 
      /**
       * @param {string} provider
       * @param {Function} [callback]
       * @returns {*}
       */
      login: function(provider, callback) {
        assertAuth();
        auth.$login(provider, {
          rememberMe: true,
          scope: 'user_photos'
        }).then(function(user) {
          ifNotInDbAddUserToDB(user);
          if( callback ) {
            //todo-bug https://github.com/firebase/angularFire/issues/199 <-- wtf is this
            $timeout(function() {
              callback(null, user);
            });
          }
        }, callback);
      }
 
 
    };
  });