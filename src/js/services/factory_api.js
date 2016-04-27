var ApiFactory = angular.module('ApiFactory', []);

ApiFactory.factory('ApiFactory', ['$http', function($http){

	function getPalette(num, callback){
		$http.get('https://qbs.arkonline.co.uk/task/colours.json?task=' + num).success(callback);
	}

	return {
		getPalette: getPalette
	}

}]);
