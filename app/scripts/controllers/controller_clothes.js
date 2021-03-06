'use strict';

angular.module('yourStyleApp')

    // wardrobe page

.controller('ClothesController', ['$scope', '$state', 'clothesFactory', 'sampleClothes', 'clothesCategories', 'AuthFactory','ngDialog', 'Upload', '$window', 
function ($scope, $state, clothesFactory, sampleClothes, clothesCategories, AuthFactory, ngDialog, Upload, $window) {                    
     $scope.tab = 0;
     $scope.filtText = '';
     $scope.isNavCollapsed = true;
    
     $scope.showClothes = false;
     $scope.showDelete = false;
     $scope.message = "Loading ...";

    $scope.seasons = [
        {value: "spring", label: "Spring"},
        {value: "summer", label: "Summer"}, 
        {value: "autumn", label: "Autumn"}, 
        {value: "winter", label: "Winter"}
    ];

    $scope.sampleClothes = sampleClothes.getSampleClothes();
    
    // gets clothes from server, if user doesn't havy any clothes, shows sample clothes
    clothesFactory.query (
        function (response) {
            if (response.length == 0) {
                $scope.clothes = $scope.sampleClothes;
                $scope.showClothes = true;
            } else {
                $scope.clothes = response; 
                $scope.showClothes = true;
                $scope.showDelete = true;
            }
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        }); 
    

        //  tabs menu 
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
            clothesFactory.delete({id: clothesid});
            $state.go($state.current, {}, {reload: true});
        }
    };
    


    // -- ADD NEW CLOTHES SECTION -- //
    
    $scope.showAddClothes = false;
    $scope.newclothes = {};
    $scope.file = {};      
    $scope.categories = clothesCategories.getCategories();
    
    // opens the add clothes form
    $scope.addClothes = function () {
        $scope.showAddClothes = !$scope.showAddClothes;
    };
          
    // uploads image to server 
    $scope.upload = function (file) {
        Upload.upload ({
            url: 'https://your-style.net/upload', // webAPI exposed to upload the file
            data: {file: file}  // pass file as data, should be user ng-model
        })
        .then (            
            function (response) {
                console.log (response.config.data.file.name + ' uploaded');
                $scope.newname = 'uploads/' + response.data;
                $scope.newclothes.image = $scope.newname;
            }, function (reject) {
                    $scope.message = "Error: " + reject.status + " " + reject.statusText;
                    console.error ($scope.message);
            },     
            function (evt) { 
                $scope.progressPercentage = parseInt (100.0 * evt.loaded / evt.total);
                $scope.progress = $scope.progressPercentage + '% loaded';
        });
    };      

    // saves clothes from add new clothes form to wardrobe
    $scope.addClothesToWardrobe = function () {
        clothesFactory.save ($scope.newclothes);
        $scope.newclothes = {};
        $scope.addClothesForm.$setPristine();
        $scope.showAddClothes = !$scope.showAddClothes;
        $state.go ($state.current, {}, {reload: true});
    };         
    
    // adds sample clothes to wardrobe 
    $scope.addSampleClothes = function () {
        for (var i = 0, l = $scope.sampleClothes.length; i < l; i++) {
            clothesFactory.save($scope.sampleClothes[i]);  
        }
        $state.go ($state.current, {}, {reload: true});
    }; 

}]);

