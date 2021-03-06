'use strict';

angular.module('yourStyleApp')

.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', 
function ($scope, $state, $rootScope, ngDialog, AuthFactory) {

    $scope.loggedIn = false;  // flip login / logout button
    $scope.username = '';
    $scope.isNavCollapsed = true;
    
    $scope.collapseNav = function () {
       $scope.isNavCollapsed = !$scope.isNavCollapsed;
    };
    
    if(AuthFactory.isAuthenticated ()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }
        
    $scope.openLogin = function () {
        ngDialog.open ({ 
            template: 'views/login.html', 
            scope: $scope, className: 'ngdialog-theme-default', 
            controller:"LoginController"
        });
    };
    
    $scope.logOut = function() {
       AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
        $state.go ($state.current, {}, {reload: true});
    };
    

    // calls the 2 functions in the end of AuthFactory
    $rootScope.$on ('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
        
    $rootScope.$on ('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
    
    // used for highlighting current page in the navbar 
    $scope.stateis = function (curstate) {
       return $state.is (curstate);  
    };   
}])


.controller('LoginController', ['$scope', '$state','ngDialog', '$localStorage', 'AuthFactory', function ($scope, $state, ngDialog, $localStorage, AuthFactory) {
    
    // retrieves user login data from local storage, if saved there
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    
    $scope.doLogin = function() {
        if ($scope.rememberMe) $localStorage.storeObject('userinfo', $scope.loginData);
        AuthFactory.login ($scope.loginData);
        ngDialog.close();
    };
     
    $scope.openRegister = function () {
        ngDialog.open ({
            template: 'views/register.html', 
            scope: $scope, className: 'ngdialog-theme-default', 
            controller:"RegisterController" 
        });
    };
}])


.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', 
function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.register = {};
    $scope.loginData = {};
    
    $scope.doRegister = function () {
        AuthFactory.register ($scope.registration);
        ngDialog.close(); 
    };
    
}]);

