'use strict';
angular.module('angularfire.login', ['firebase', 'angularfire.firebase'])
 
  .run(function($rootScope, simpleLogin, firebaseRef) {
    simpleLogin.init();
    $rootScope.$on('$firebaseSimpleLogin:login', function() {
      var userReflol = firebaseRef("users/" + $rootScope.auth.user.uid + "/sensor");
      userReflol.once('value', function(dataSnapshot) {
        dataSnapshot.forEach(function(pikk) {
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
          initShop();
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
    };

    function initShop() {
      var purchasedItemsRef = firebaseRef('/users/' + $rootScope.auth.user.uid + '/purchased_items/');
      purchasedItemsRef.set({
        item_1: {hasItem: false, url: "https://s3-eu-west-1.amazonaws.com/powerhack/paafugl.png", price: 30},
        item_2: {hasItem: false, url: "http://dhtmlconf.com/img/new.gif", price: 20},
        item_3: {hasItem: false, url: "http://dhtmlconf.com/img/hot.gif", price: 10},
        item_4: {hasItem: false, url: "http://dhtmlconf.com/img/counter2.gif", price: 15},
        item_5: {hasItem: false, url: "http://dhtmlconf.com/img/notepad.gif", price: 25},
        item_6: {hasItem: false, url: "http://dhtmlconf.com/img/ie_logo.gif", price: 5}
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