console.log('app is running...');

var colourPickerApp = angular.module('ColourPickerApp', ['ApiFactory', 'PaletteFactory', 'PaletteCtrl']);
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
var ApiFactory = angular.module('ApiFactory', []);

ApiFactory.factory('ApiFactory', ['$http', function($http){

	function getPalette(num, callback){
		$http.get('https://qbs.arkonline.co.uk/task/colours.json?task=' + num).success(callback);
	}

	return {
		getPalette: getPalette
	}

}])
var PaletteFactory = angular.module('PaletteFactory', []);

PaletteFactory.factory('PaletteFactory', [function(){

	function rgbNumberToHex(rgbNumber) {
		var hex = rgbNumber.toString(16);
		return hex.length == 1 ? '0' + hex : hex;
	}

	function rgbToHex(array){
		return '#' + rgbNumberToHex(array[0]) + rgbNumberToHex(array[1]) + rgbNumberToHex(array[2]);
	}

	function tintCalculator(rbgColour, tint){
		var modifiedRbgColour = [];
		for(var i = 0; i < 3; i++){
			var modifiedRbgValue = rbgColour[i] + tint[i];
			if(modifiedRbgValue < 0){
				modifiedRbgValue = 0;
			}
			if(modifiedRbgValue > 255){
				modifiedRbgValue = 255;
			}
			modifiedRbgColour[i] = modifiedRbgValue;
		}
		return modifiedRbgColour;
	}

	function createPalette(arrayOfPalette){
		var convertedPalette = [];

		for(var i = 0; i < arrayOfPalette.length; i++){
			var paletteElement = {};
			paletteElement.name = arrayOfPalette[i].name;
			paletteElement.rgb = arrayOfPalette[i].baseColour;
			paletteElement.hex = rgbToHex(arrayOfPalette[i].baseColour);
			paletteElement.opacity = 1;
			paletteElement.tints = [];
			for(var j = 0; j < arrayOfPalette[i].tints.length; j++){
				var tint = {};
				tint.rgb = tintCalculator(arrayOfPalette[i].baseColour, arrayOfPalette[i].tints[j]);
				tint.hex = rgbToHex(tint.rgb);
				paletteElement.tints.push(tint);
			}
			convertedPalette.push(paletteElement);
		}

		return convertedPalette;
	}

	return {
		createPalette: createPalette
	}

}])