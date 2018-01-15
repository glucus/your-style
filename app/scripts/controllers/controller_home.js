'use strict';

angular.module('yourStyleApp')

.controller('HomeController', ['$scope', 'looksFactory', function ($scope, looksFactory) {     

    var looks = looksFactory.query ({
        featured: "true"
    })
    .$promise.then (
        function (response) {
            $scope.looks = response;
            $scope.showLook = true;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        }
    );
}])


