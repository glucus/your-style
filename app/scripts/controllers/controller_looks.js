'use strict';

angular.module('yourStyleApp')

    // Page 2 -- /looks  

.controller('LooksController', ['$scope', '$state', 'looksFactory', function ($scope, $state, looksFactory) { 

    $scope.filtText = '';
    
    $scope.showLooks = false;
    $scope.message = "Loading ...";
    
        // gets the existing looks to the gallery. 
        
    looksFactory.query (
        function (response) {
            $scope.looks = response;
            $scope.showLooks = true;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });

    $scope.deleteLook = function(lookid) {
        
        if ( window.confirm ("Do you really want to delete this item?")) { 
            
            console.log('Delete look', lookid);
            looksFactory.delete({id: lookid});
            $state.go($state.current, {}, {reload: true});
        };
    };
}])
