'use strict';

angular.module('yourStyleApp')


    // Page 1 -- /wardrobe 

.controller('ClothesController', ['$scope', '$state', 'clothesFactory', 'AuthFactory','ngDialog', 'Upload', '$window', function ($scope, $state, clothesFactory, AuthFactory, ngDialog, Upload, $window) {           
                

     $scope.tab = 0;
     $scope.filtText = '';
     $scope.isNavCollapsed = true;
    
     $scope.showClothes = false;
     $scope.showDelete = false;
    
     $scope.message = "Loading ...";

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
                    // response.concat($scope.sampleClothes);
                $scope.showClothes = true;
                $scope.showDelete = true;
            }
        },
         
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        }); 
    

    
        // for tab menu 
    
    $scope.collapseNav = function () {
       $scope.isNavCollapsed = !$scope.isNavCollapsed;
    };
    
    
    $scope.select = function (setTab) {
        $scope.tab = setTab;

        if (setTab === 1) {
            $scope.filtText = "tops";
        } else if (setTab === 2) {
            $scope.filtText = "jeans and pants";
        } else if (setTab === 3) {
            $scope.filtText = "jackets";
        } else if (setTab === 4) {
            $scope.filtText = "skirts";
        } else if (setTab === 5) {
            $scope.filtText = "dresses";
        } else if (setTab === 6) {
            $scope.filtText = "shoes";
        } else if (setTab === 7) {
            $scope.filtText = "bags";
        } else if (setTab === 8) {
            $scope.filtText = "accessories";
        } else if (setTab === 9) {
            $scope.filtText = "other";   
        } else {
            $scope.filtText = "";
        }
        
        $scope.isNavCollapsed = !$scope.isNavCollapsed;
    };

    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };
 
        
    $scope.deleteClothes = function(clothesid) {
        
        if ( window.confirm ("Do you really want to delete this item ?")) { 
            
            console.log('Delete clothes', clothesid);
            clothesFactory.delete({id: clothesid});
            $state.go($state.current, {}, {reload: true});
        };
    };
      
    
    // for add new clothes part of page
    
    $scope.showAddClothes = false;
    
    $scope.newclothes = {};
    
    $scope.categories = [
        {
            value: "tops",
            label: "Tops",
            id: 1
        }, {
            value: "jeans and pants",
            label: "Jeans and pants",
            id: 2
        }, {
            value: "jackets",
            label: "Jackets",
            id: 3
        }, {
            value: "skirts",
            label: "Skirts",
            id: 4
         }, {
            value: "dresses",
            label: "Dresses",
             id: 5
         }, {
            value: "shoes",
            label: "Shoes",
             id: 6
         }, {
            value: "bags",
            label: "Bags",
             id: 7
         }, { 
            value: "accessories",
            label: "Accessories",
             id: 8
        }, {
            value: "other",
            label: "Other",
            id: 9
        }
    ];
    
    
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
    
    
    
    // toggles the add clothes form open
    
        $scope.addClothes = function () {
            $scope.showAddClothes = !$scope.showAddClothes;
        };
                
    /*--- file upload ----*/
        
        $scope.file = {};    
                
        $scope.upload = function (file) {
            
            Upload.upload ({
                url: 'https://your-style.net/upload', //webAPI exposed to upload the file
                data: {file: file} //pass file as data, should be user ng-model
            })
            
            
            .then (            
                function (response) { 
                    console.log('Success ' + response.config.data.file.name + ' uploaded');
                    console.log(response);
                    $scope.newname = 'uploads/'+response.data;
                    $scope.newclothes.image = $scope.newname;

                }, function (response) {
                     $scope.message = "Error: " + response.status + " " + response.statusText;
                     $window.alert('image upload error');
                },     

                function (evt) { 
                    console.log(evt);
                    $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);

                    $scope.progress = $scope.progressPercentage + '% loaded';
                    console.log(evt.config.data.file.name + $scope.progress);
            });
        };      
    
             //  $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
    
    
            // adds clothes from form to the clothes collection
    
        $scope.addClothesToWardrobe = function () {
            
            clothesFactory.save($scope.newclothes);
            
            $scope.newclothes = {};
            $scope.addClothesForm.$setPristine();
            $scope.showAddClothes = !$scope.showAddClothes;
            $state.go($state.current, {}, {reload: true})
        };         
     
        $scope.addSampleClothes = function () {
            
            for (var i = 0, l = $scope.sampleClothes.length; i < l; i++) {
                
                clothesFactory.save($scope.sampleClothes[i]);  
            };
            $state.go($state.current, {}, {reload: true})
        };
    
    
}])



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




.controller('HomeController', ['$scope', 'looksFactory', 
                               function ($scope, looksFactory) {     
    
    var looks = looksFactory.query({
                featured: "true"
            })
            .$promise.then (
                function (response) {
                    $scope.looks = response;
                    $scope.showLook = true;
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                });
    }])




// used for logging in and out
.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, AuthFactory) {

    $scope.loggedIn = false;  // flip login / logout button
    $scope.username = '';
    $scope.isNavCollapsed = true;
    
    $scope.collapseNav = function () {
       $scope.isNavCollapsed = !$scope.isNavCollapsed;
    };
    
    
    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }
        
        // opens the login modal
    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
    };
    
    $scope.logOut = function() {
        
       AuthFactory.logout();
        
        $scope.loggedIn = false;
        $scope.username = '';
        $state.go($state.current, {}, {reload: true});

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
        // setting the active class
    $scope.stateis = function (curstate) {
       return $state.is (curstate);  
    };
    
    
}])


    // manages the ngDialog box (used instead of login modal)

.controller('LoginController', ['$scope', '$state','ngDialog', '$localStorage', 'AuthFactory', function ($scope, $state, ngDialog, $localStorage, AuthFactory) {
    
    
        // retrieves the user login data from local storage, if saved there
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    
    $scope.doLogin = function() {
        if($scope.rememberMe)
           $localStorage.storeObject('userinfo',$scope.loginData);

        AuthFactory.login($scope.loginData);

        ngDialog.close();
    };
            
    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };
    
}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.register={};
    $scope.loginData={};
    
    
    $scope.doRegister = function() {
        console.log('Doing registration', $scope.registration);

        AuthFactory.register($scope.registration);
        
        ngDialog.close();
         
    };
    
    
    
}])
;
