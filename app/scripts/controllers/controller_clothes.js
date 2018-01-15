'use strict';

angular.module('yourStyleApp')

    // wardrobe page

.controller('ClothesController', ['$scope', '$state', 'clothesFactory', 'sampleClothesFactory', 'AuthFactory','ngDialog', 'Upload', '$window', function ($scope, $state, clothesFactory, sampleClothesFactory, AuthFactory, ngDialog, Upload, $window) {                    
     $scope.tab = 0;
     $scope.filtText = '';
     $scope.isNavCollapsed = true;
    
     $scope.showClothes = false;
     $scope.showDelete = false;
     $scope.message = "Loading ...";

     $scope.sampleClothes = sampleClothesFactory.getSampleClothes();
    
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
        
        if (window.confirm ("Do you really want to delete this item ?")) { 
            console.log('Delete clothes', clothesid);
            clothesFactory.delete({id: clothesid});
        //    $state.go($state.current, {}, {reload: true});
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

