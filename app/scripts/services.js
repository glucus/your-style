'use strict';

angular.module('yourStyleApp')

.constant("baseURL", "https://your-style.net/") //"localhost:3000"

     // for /wardrobe page
.factory('clothesFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

    return $resource (baseURL + "clothes/:id", null, {
            'update': {
                method: 'PUT'
            }
    }); 
}])

.service('sampleClothes', function () {

    var sampleClothes = [
        {
            name: 'beige sweater',
            image: 'images/beigesweater.jpg',
            category: 'tops'
         },
        {
            name: 'blue shirt',
            image: 'images/blueshirt.jpg',
            category: 'tops'
         },
        {
            name: 'dark jeans',
            image: 'images/jeansandboots.jpg',
            category: 'jeans and pants'
         },
        {
            name: 'blue jeans',
            image: 'images/jeansandsneakers.jpg',
            category: 'jeans and pants'
         },
        {
            name: 'black boots',
            image: 'images/blackboots.jpg',
            category: 'shoes'
         },
        {
            name: 'leather belt',
            image: 'images/belt.jpg',
            category: 'accessories'
         },
        {
            name: 'brown bag',
            image: 'images/brownbag.jpg',
            category: 'bags'
         },
        {
            name: 'green hat',
            image: 'images/hat.jpg',
            category: 'accessories'
         }
     ];
    
     this.getSampleClothes = function () {
         return sampleClothes;
     }
});


     // for /createlook page

    // angular wrapper of html2canvas package    (http://html2canvas.hertzen.com/documentation.html ) from here:  https://github.com/tristansokol/html2canvas-angular


.factory('html2canvasAngular', ['$q', function($q) {
    
	self={
		renderBody: function(){
			var deferred = $q.defer();

                // html2canvas(which element to take screenshot, options);
			html2canvas(document.getElementById('lookConstructor'), {
				onrendered: function(canvas) {
                    
                        // canvas is the final rendered <canvas> element
					deferred.resolve(canvas);
				},
                background: '#ffffff',
                allowTaint: true, 
                 
                useCORS: true, // this setting is here to allow cross-origin images (will appear on the canvas but can't be saved)
                
             //   height: 800, -- can be set to a specific value, if not they will be auto 
             //   width: 600
                
			});      
            
			return deferred.promise;
		}
	}
	return self;
        
}])


.factory('looksFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
    
    return $resource(baseURL + "looks/:id", null, {
        
            'update': {
                method: 'PUT'
            }
        });
}])

// Used for user authentication

.factory('$localStorage', ['$window', function ($window) {
    
    // token sent from the server as a JS object, stored in localstorage and included in all subsequent outgoing requests in the header, once the user logs out the token is deleted from localstorage --> is not valid animore

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
      // can add reissuing token here to avoid its expiration
    
  function loadUserCredentials() {
      
    var credentials = $localStorage.getObject (TOKEN_KEY,'{}');
    if (credentials.username != undefined) {
      useCredentials(credentials);
    }
  }
 
    function storeUserCredentials(credentials) {   
        $localStorage.storeObject(TOKEN_KEY, credentials);
        useCredentials(credentials);
    }
    
  function useCredentials(credentials) {
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
    
    authFac.login = function(loginData) {   
        // loginData - coming from controller (username, password)
        
        $resource (baseURL + "users/login")
        
        .save (loginData,

           function (response) { // response contains token 

              storeUserCredentials (
                  {username: loginData.username, token: response.token});  
                      // Saves credentials to localStorage.   encryption can be added here

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
                </div>'

                ngDialog.openConfirm({ template: message, plain: 'true'});
           }
        );
    };
       
    
    authFac.logout = function() {
        $resource (baseURL + "users/logout")
            .get(function(response) {
        });
        destroyUserCredentials();   // see above in Local Storage
    };
    
    authFac.register = function (registerData) {
        
        $resource(baseURL + "users/register")
        
        .save (registerData,
              
           function(response) {  // success function - do login
            
              authFac.login ({username:registerData.username, password:registerData.password});
            
            
            if (registerData.rememberMe) {
                $localStorage.storeObject('userinfo',
                    {username:registerData.username, password:registerData.password});
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
    
    // used in controller for header (what button to show - login or logout)
    
    authFac.isAuthenticated = function() {
        return isAuthenticated;
    };
    
    authFac.getUsername = function() {
        return username;  
    };
    
        // when app starts running
    loadUserCredentials();
    
    return authFac;
}])
;