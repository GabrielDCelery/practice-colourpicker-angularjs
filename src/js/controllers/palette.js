var PaletteCtrl = angular.module('PaletteCtrl', []);

PaletteCtrl.controller('PaletteCtrl', ['$scope', 'ApiFactory', 'PaletteFactory', function($scope, ApiFactory, PaletteFactory){

	console.log('palette controller is running...');

/************************************************************************
FUNCTIONS
************************************************************************/

	$scope.palette =[];

	function createBackgroundStyle(rgbArray){
		var styleString = '';
		styleString = "{'background-color': 'rgb(" + rgbArray[0] + "," + rgbArray[1] + "," + rgbArray[2] + ")'}";
		return styleString;
	}

	function getPalette(num){
		ApiFactory.getPalette(num, function(response){
			$scope.palette = PaletteFactory.createPalette(response);
		});
	}

/************************************************************************
EVENT BINDERS
************************************************************************/

	$scope.getPalette = getPalette;
	$scope.createBackgroundStyle = createBackgroundStyle;

/************************************************************************
INITIATING FUNCTION UPON LOADING
************************************************************************/

	getPalette(1);

}])