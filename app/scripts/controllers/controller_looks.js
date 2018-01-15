'use strict';

angular.module('yourStyleApp')

    // looks page  

.controller('LooksController', ['$scope', '$state', 'looksFactory', function ($scope, $state, looksFactory) { 
   
    $scope.showLooks = false;
    $scope.message = "Loading ...";

    // get looks from server 

    looksFactory.query (
        function (response) {
            $scope.looks = response;
            $scope.showLooks = true;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });


    // delete look from gallery

    $scope.deleteLook = function(lookid) {
        if ( window.confirm ("Do you really want to delete this item?")) {
            console.log ('Delete look', lookid);
            looksFactory.delete ({id: lookid});
            $state.go ($state.current, {}, {reload: true});
        };
    };

}])
