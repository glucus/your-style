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
        

    // gets clothes from server, if user doesn't havy any clothes, shows sample clothes

    clothesFactory.query (
        function (response) {
            if (response.length == 0) {
                console.log (response.length);
                $scope.clothes = $scope.sampleClothes;
                $scope.showClothes = true;
            } else {
                console.log (response.length);
                $scope.clothes = response; 
                $scope.showClothes = true;
            }
        }, 
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
    }); 

    
    /*  drag & drop uses NgDraggable package
        https://github.com/fatlinesofcode/ngDraggable */ 
     
    // 2 parts of dropzone 
    $scope.clothesDrop = [];
    $scope.clothesDrop2 = [];

    $scope.onDragComplete = function(data, evt) {
        console.log("drag success, data:", data);
        var index = $scope.clothesDrop.indexOf(data);
        if (index > -1) {
            $scope.clothesDrop.splice(index, 1);
        }
    }
    
    $scope.onDragComplete2 = function(data, evt) {
        console.log("drag success, data:", data);
        var index = $scope.clothesDrop2.indexOf(data);
        if (index > -1) {
            $scope.clothesDrop2.splice(index, 1);
        }
    }  
    
    $scope.onDropComplete = function(data, evt) {
        console.log("drop success, data:", data);
        var index = $scope.clothesDrop.indexOf(data);
        if (index == -1) {
            $scope.clothesDrop.push(data);
            $scope.checkStyle(data)
        };
    }
    
    $scope.onDropComplete2 = function(data, evt) {
        console.log("drop success, data:", data);
        var index = $scope.clothesDrop2.indexOf(data);
        if (index == -1) {
            $scope.clothesDrop2.push(data);
            $scope.checkStyle(data)
        };
    }
    
    $scope.onDropCompleteInput = function(data, evt) {
        console.log("drop on input success, data:", data);
        $scope.input = data;
    }
    
    $scope.onDropCompleteRemove = function(data, evt) {
        console.log("drop success - remove, data:", data);
        var index = $scope.clothesDrop.indexOf(data);
        if (index != -1)
        $scope.clothesDrop.splice(index);
    }
    
    $scope.onDropCompleteRemove2 = function(data, evt) {
        console.log("drop success - remove, data:", data);
        var index = $scope.clothesDrop2.indexOf(data);
        if (index != -1)
        $scope.clothesDrop2.splice(index);
    }
    
    var onDraggableEvent = function(evt, data) {
        console.log("128", "onDraggableEvent", evt, data);
    }
    
    $scope.$on('draggable:start', onDraggableEvent);
    //$scope.$on('draggable:move', onDraggableEvent);
    $scope.$on('draggable:end', onDraggableEvent);
    
    

    // checks category of dragged object to set the image max-size in the dropzone
    $scope.checkStyle = function(data) {
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
        };
        console.log(data, $scope.imageSizeLimit);
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
            
            // clears the form and image div after saving
            $scope.newlook = {};
            $scope.newLookForm.$setPristine();
            document.getElementById('box1').innerHTML = "";
            $state.go($state.current, {}, {reload: true}); 
        }); 
    };   
    
}]) 

        