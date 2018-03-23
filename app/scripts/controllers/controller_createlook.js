'use strict';

angular.module('yourStyleApp')

// createlook page 

.controller('CreateLookController', ['$scope', '$state','clothesFactory', 'sampleClothes', 'html2canvasAngular', 'looksFactory', 
function ($scope, $state, clothesFactory, sampleClothes, html2canvasAngular, looksFactory) {
        
    $scope.filtText = '';
    $scope.showClothes = false; 
    $scope.newlook = {};
    $scope.sampleClothes = sampleClothes.getSampleClothes();           
    
    $scope.seasons = [
        {value: "spring", label: "Spring"},
        {value: "summer", label: "Summer"}, 
        {value: "autumn", label: "Autumn"}, 
        {value: "winter", label: "Winter"}
    ];
        

    // gets clothes from server, if user doesn't have any clothes, shows sample clothes

    clothesFactory.query (
        function (response) {
            if (response.length == 0) {
                $scope.clothes = $scope.sampleClothes;
                $scope.showClothes = true;
            } else {
                $scope.clothes = response; 
                $scope.showClothes = true;
            }
        }, 
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
    }); 

    
    
    // checks category of dragged object to set the image max-size in the dropzone
    $scope.checkStyle = function (data) {
        if (data.category === "shoes" || data.category === "accessories") {
            $scope.imageSizeLimit = {
                "max-height" : "300px", 
                "max-width": "300px" 
            };
        } else if (data.category === "dresses") {
            $scope.imageSizeLimit = {
                "max-height" : "600px",
                "max-width": "300px"
            }; 
        } else {
            $scope.imageSizeLimit = {
                "max-height" : "300px",
                "max-width": "300px"
            };
        }
    };
    
    /*  drag & drop uses NgDraggable package
        https://github.com/fatlinesofcode/ngDraggable */ 
     
    // 2 dropzones
    $scope.clothesDrop = [];
    $scope.clothesDrop2 = [];

    $scope.onDragComplete = function (data, evt, dropzone) {
        var index = dropzone.indexOf (data);
        if (index > -1) {
            dropzone.splice (index, 1);
        }
    };
        
    $scope.onDropComplete = function (data, evt, dropzone) {
        var index = dropzone.indexOf(data);
        if (index == -1) {
            dropzone.push (data);
            $scope.checkStyle (data);
        }
    };
    

    // saves drop zone content as an image to a div #box1 (clearing it first) using html2canvas
    $scope.takeLookScreenshot = function () {

        document.getElementById('box1').innerHTML = "";  
        html2canvasAngular.renderBody().then (function (canvas) {
            document.getElementById('box1').appendChild(canvas);
 
            // converts canvas content to base64 format https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL;
            $scope.lookDataURL = canvas.toDataURL('image/jpeg', 1.0);
        });
    };


    // saves look to gallery  
    $scope.addLook = function () { 

        document.getElementById('box1').innerHTML = ""; // clears the div
        html2canvasAngular.renderBody().then (function (canvas) {

            document.getElementById('box1').appendChild(canvas);
            $scope.newlook.image = canvas.toDataURL('image/jpeg', 1.0);    
            looksFactory.save ($scope.newlook);
        }); 
    };
    
    $scope.refreshForm = function () {
        $scope.newlook = {};
        document.getElementById('box1').innerHTML = "";
        $state.go($state.current, {}, {reload: true}); 
    };  
}]);

        