'use strict';

angular
    .module('yourStyleApp', ['ui.router', 'ui.bootstrap', 'ngResource', 'ngDialog', 'ngDraggable', 'html2canvasAngular', 'ngFileUpload']) 


    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        
            // route for the home page
        
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
                        templateUrl : 'views/home.html',
                        controller  : 'HomeController'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html',
                    }
                }

            })
    
    
          // routes for other three pages
    
            .state('app.clothes', {
                url:'clothes',
                views: {
                    'content@': {
                        templateUrl : 'views/clothes.html',
                        controller  : 'ClothesController'  
                    }
                }
            })    
        
    
            .state('app.looks', {
                url:'looks',
                views: {
                    'content@': {
                        templateUrl : 'views/looks.html',
                        controller  : 'LooksController'
                    }
                }
            })
    
    
            .state('app.createlook', {
                url:'createlook',
                views: {
                    'content@': {
                        templateUrl : 'views/createlook.html',
                        controller  : 'CreateLookController'  
                    }
                }
            })
    
        $urlRouterProvider.otherwise('/');
    })
;
