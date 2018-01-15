'use strict';
angular.module('yourStyleApp')

.constant("baseURL", "https://your-style.net/") //"localhost:3000"

// services for wardrobe and createlook pages

.factory('clothesFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

    return $resource (baseURL + "clothes/:id", null, {
            'update': {
                method: 'PUT'
            }
    }); 
}])


.service('sampleClothes', function () {

    var sampleClothes = [
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
    
     this.getSampleClothes = function () {
         return sampleClothes;
     }
})


.service('clothesCategories', function() {

    var clothesCategories = [
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
    
    this.getCategories = function() {
        return clothesCategories;
    }
})


// for Looks page

.factory('looksFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
    
    return $resource(baseURL + "looks/:id", null, {
        
            'update': {
                method: 'PUT'
            }
        });
}])
;