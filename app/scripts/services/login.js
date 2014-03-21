'use strict';
angular.module('angularfire.login', ['firebase', 'angularfire.firebase'])
 
  .run(function(simpleLogin) {
    simpleLogin.init();
  })
 
  .factory('simpleLogin', function($rootScope, $firebaseSimpleLogin, firebaseRef, $timeout, syncData) {
    function assertAuth() {
      if( auth === null ) { throw new Error('Must call loginService.init() before using its methods'); }
    }
 
    function ifNotInDbAddUserToDB(user){ // Legger til brukeren i databasen hvis den ikke er der enda.
      var usersRef = firebaseRef("users");
      usersRef.once('value', function(dataSnapshot) {
        if(!dataSnapshot.hasChild(user.uid)){
          var userRef = firebaseRef("users/" + user.uid + '/user_info/');
          userRef.set(user);
        };
      });
    }
   
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