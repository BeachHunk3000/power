'use strict';
angular.module('angularfire.login', ['firebase', 'angularfire.firebase'])
 
  .run(function(simpleLogin) {
    simpleLogin.init();
  })
 
  .factory('simpleLogin', function($rootScope, $firebaseSimpleLogin, firebaseRef, $timeout, syncData) {
    function assertAuth() {
      if( auth === null ) { throw new Error('Must call loginService.init() before using its methods'); }
    };
 
    function ifNotInDbAddUserToDB(user){ // Legger til brukeren i databasen hvis den ikke er der enda.
      var usersRef = firebaseRef("users");
      console.log(user);
      usersRef.once('value', function(dataSnapshot) {
        if(!dataSnapshot.hasChild(user.uid)){
          var userRef = firebaseRef("users/" + user.uid + '/user_info/');
          userRef.set(user);
          addSensor(user.uid);
        };
      });
    };

    function addSensor(user_uid) {
      var sensorsRef = firebaseRef("/sensors/");
      var usersRef = firebaseRef("/users/");
      var freeSensor = null;

      sensorsRef.once('value', function(sensors) {
        sensors.forEach(function(sensor) {
          console.log(sensor.val());
          var useThisSensor = true;

          usersRef.once('value', function(users) {
            users.forEach(function(user) {
                if(user.val().sensor === freeSensor){
                  useThisSensor = false;
                };
            });
          });

          if(useThisSensor) {
            var mySensorRef = firebaseRef('/users/' + user_uid + '/sensor');
            mySensorRef.set(sensor.val());
            return;
          };

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