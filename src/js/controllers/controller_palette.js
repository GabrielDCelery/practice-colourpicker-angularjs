var PaletteCtrl = angular.module('PaletteCtrl', []);

PaletteCtrl.controller('PaletteCtrl', ['$scope', 'ApiFactory', 'PaletteFactory', function($scope, ApiFactory, PaletteFactory){

	console.log('palette controller is running...');


/************************************************************************
VARIABLES
************************************************************************/	

	$scope.jsonPalette = [];
	$scope.palette =[];

	$scope.slider = {
		rgb: [0, 0, 0],
		opacity: 0
	}

	var currentlySelected = 0;

/************************************************************************
FUNCTIONS
************************************************************************/

	function arrayStringToInteger(array){
		for(var i = 0; i < array.length; i++){
			array[i] = parseInt(array[i]);
		}
		return array;
	}

	function setSliders(rgb, opacity, index){
		currentlySelected = index;
		$scope.slider = {
			rgb: [rgb[0], rgb[1], rgb[2]], 
			opacity: opacity
		}
	}

	function modifyColour(rgb){
		arrayStringToInteger(rgb);
		$scope.palette[currentlySelected].hex = PaletteFactory.rgbToHex(rgb)
		$scope.palette[currentlySelected].rgb = rgb;
		var tintModifiers = $scope.jsonData[currentlySelected].tints;
		for(var i = 0; i < tintModifiers.length; i++){
			var modifiedTint = PaletteFactory.tintCalculator($scope.palette[currentlySelected].rgb, tintModifiers[i]);
			$scope.palette[currentlySelected].tints[i].hex = PaletteFactory.rgbToHex(modifiedTint);
			$scope.palette[currentlySelected].tints[i].rgb = modifiedTint;
		}
	}

	function modifyOpacity(opa){
		$scope.palette[currentlySelected].opacity = opa;
	}

	function getPalette(num){
		ApiFactory.getPalette(num, function(response){
			$scope.jsonData = response;
			$scope.palette = PaletteFactory.createPalette(response);
			setSliders($scope.palette[0].rgb, $scope.palette[0].opacity, 0);
		});
	}

/************************************************************************
EVENT BINDERS
************************************************************************/

	$scope.getPalette = getPalette;
	$scope.setSliders = setSliders;
	$scope.modifyColour = modifyColour;
	$scope.modifyOpacity = modifyOpacity;

/************************************************************************
INITIATING FUNCTION UPON LOADING
************************************************************************/

	getPalette(1);

}])