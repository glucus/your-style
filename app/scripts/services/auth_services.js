'use strict';
angular.module('yourStyleApp')

.constant("baseURL", "https://your-style.net/") //"localhost:3000"


// $localStorage - used for user authentication

.factory('$localStorage', ['$window', function ($window) {
    
// token sent from the server as a JS object, stored in localstorage and included in all subsequent outgoing requests in the header, once the user logs out the token is deleted from localstorage --> not valid animore

    return {
        store: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        },
        storeObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    }
}])



.factory('AuthFactory', ['$resource', '$http', '$state', '$localStorage', '$rootScope', '$window', 'baseURL', 'ngDialog', function ($resource, $http, $state, $localStorage, $rootScope, $window, baseURL, ngDialog) {
    
    var authFac = {};
    var TOKEN_KEY = 'Token';  

    var isAuthenticated = false;
    var username = '';
    var authToken = undefined;
    

    // retrieves credentials from local storage (used when app restarts)
    
  function loadUserCredentials() {
    var credentials = $localStorage.getObject (TOKEN_KEY,'{}');
    if (credentials.username != undefined) {  
      useCredentials (credentials);
    }
  }
 
    function storeUserCredentials(credentials) {   
        $localStorage.storeObject(TOKEN_KEY, credentials);
        useCredentials (credentials);
    }

  function useCredentials (credentials) {
    isAuthenticated = true;
    username = credentials.username;
    authToken = credentials.token;
        // sets the token as a default header for all requests
    $http.defaults.headers.common['x-access-token'] = authToken;        
  }
 
  function destroyUserCredentials() {
      authToken = undefined;
      username = '';
      isAuthenticated = false;
      $http.defaults.headers.common['x-access-token'] = authToken;
      $localStorage.remove(TOKEN_KEY);
  }
    

    // log in 
    authFac.login = function (loginData) {   
        // loginData - user input, comes from controller
        
        $resource (baseURL + "users/login").save(loginData,

           function (response) { // response contains token 
              storeUserCredentials ({username: loginData.username, token: response.token});  // saves credentials to localStorage. encryption can be added here      
              $rootScope.$broadcast('login:Successful'); // informs the controller 
              $state.go ($state.current, {}, {reload: true}); 
           },

           function (response) {  // error callback function
              isAuthenticated = false;
              var message = '\
                <div class="ngdialog-message">\
                <div><h3>Login Unsuccessful</h3></div>' +
                  '<div><p>' +  response.data.err.message + '</p><p>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                </div>';
                ngDialog.openConfirm({ template: message, plain: 'true'});
           }
        );
    };
       

    // log out 
    authFac.logout = function() {
        $resource (baseURL + "users/logout").get (function (response){});
        destroyUserCredentials();
    };
    

   // registration
    authFac.register = function (registerData) {
        
        $resource(baseURL + "users/register").save (registerData, // registerData - user input 
            
            function(response) {  // success function - do login
                authFac.login ({username:registerData.username, password:registerData.password});
                if (registerData.rememberMe) {
                    $localStorage.storeObject('userinfo', {username:registerData.username, password:registerData.password});
                }
                $rootScope.$broadcast('registration:Successful');
            }, 
            function (response) {  // error function
                var message = '\
                    <div class="ngdialog-message">\
                    <div><h3>Registration Unsuccessful</h3></div>' +
                    '<div><p>' +  response.data.err.message + 
                    '</p></div>';
                ngDialog.openConfirm({ template: message, plain: 'true'});
            }
        );
    };
    
    // functions used in controller for header section
    authFac.isAuthenticated = function() { 
        return isAuthenticated;
    };
    
    authFac.getUsername = function() {
        return username;         
    };
    
    loadUserCredentials();  // when app starts running

    return authFac;
}])
;