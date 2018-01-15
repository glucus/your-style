
'use strict';
angular.module('yourStyleApp')

// html2canvas angular wrapper ( https://github.com/tristansokol/html2canvas-angular) 

.factory('html2canvasAngular', ['$q', function($q) {
	self = {
		renderBody: function () {
			var deferred = $q.defer();

            // html2canvas (which element to take screenshot, options);
			html2canvas(document.getElementById('lookConstructor'), {

				onrendered: function(canvas) {
                    // canvas is the final rendered <canvas> element
					deferred.resolve(canvas);
				},
                background: '#ffffff',
                allowTaint: true, 
                useCORS: true, // allows cross-origin images (will appear on the canvas but can't be saved)
             //   height: 800, -- can be set to a specific value, if not they will be auto 
             //   width: 600
			});      
			return deferred.promise;
		}
	}
	return self;  
}])
;