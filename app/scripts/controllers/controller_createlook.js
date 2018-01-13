'use strict';

angular.module('yourStyleApp')

    // Page 3 -- /createlook ) 

    .controller('CreateLookController', ['$scope', '$state','clothesFactory', 'html2canvasAngular', 'looksFactory', function ($scope, $state, clothesFactory, html2canvasAngular, looksFactory) {
        
            
            $scope.filtText = '';
            $scope.showClothes = false; 
                
            $scope.newlook = {};
                
            $scope.seasons = [
                {
                value: "spring",
                label: "Spring"
            }, {
                value: "summer",
                label: "Summer"
            }, {
                value: "autumn",
                label: "Autumn"
            }, {
                value: "winter",
                label: "Winter"
            }
            ];
               
             $scope.sampleClothes = [
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
            
                 // gets existing clothes to the list
            
             clothesFactory.query(
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
        
            
            /*  drag & drop functional was implemented using NgDraggable package
                https://github.com/fatlinesofcode/ngDraggable */ 
            
             
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
                $scope.checkStyle(data)};
            }
            
            $scope.onDropComplete2 = function(data, evt) {
              console.log("drop success, data:", data);
              var index = $scope.clothesDrop2.indexOf(data);
              if (index == -1) {
                $scope.clothesDrop2.push(data);
                $scope.checkStyle(data)};
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
          
            
            // this fuction checks the category of clothes that are being dragged in order to set the image max-sized for ng-style of dropzone
            
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
            
  
            $scope.takeLookScreenshot = function () {
                
                // saves the drop zone content as an image in div 'box1' using html2canvas
                
                document.getElementById('box1').innerHTML = ""; // clears the div
                
                
                html2canvasAngular.renderBody().then (function (canvas) {
                    
                    document.getElementById('box1').appendChild(canvas);
        
                    // converts canvas content to base64 format so it can be transferred to server (https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL); 
        
                    $scope.lookDataURL = canvas.toDataURL('image/jpeg', 1.0);
                });
                
            };
        
            $scope.addLook = function () {
                
                // saves the drop zone content as an image in div 'box1' using html2canvas
                
                document.getElementById('box1').innerHTML = ""; // clears the div
                
                html2canvasAngular.renderBody().then (function (canvas) {
                    
                    document.getElementById('box1').appendChild(canvas);
                    
                    $scope.newlook.image = canvas.toDataURL('image/jpeg', 1.0);
                 //   $scope.newlook.lookComponents = $scope.clothesDrop;
         
                    looksFactory.save ($scope.newlook);
        
                    $scope.newlook = {};
                    $scope.newLookForm.$setPristine();
                    document.getElementById('box1').innerHTML = "";
                    $state.go($state.current, {}, {reload: true}); 
                }); 
            };   
           
        }]) 
        
        