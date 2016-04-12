console.log('app is running...');

var colourPickerApp = angular.module('ColourPickerApp', ['ApiFactory', 'PaletteFactory', 'ObjectManipulatorFactory', 'PaletteCtrl']);



var PaletteCtrl = angular.module('PaletteCtrl', []);

PaletteCtrl.controller('PaletteCtrl', [
	'$scope', 
	'ApiFactory', 
	'PaletteFactory', 
	'ObjectManipulatorFactory', 
	function(
		$scope, 
		ApiFactory, 
		PaletteFactory,
		ObjectManipulatorFactory
	){

	console.log('palette controller is running...');


/************************************************************************
VARIABLES
************************************************************************/	

	$scope.jsonPalette = [];
	$scope.palette = [];

	$scope.slider = {
		rgb: [0, 0, 0],
		opacity: 0
	}

	var currentlySelected = 0;

/************************************************************************
COLOUR PALETTE MODIFIER FUNCTIONS
************************************************************************/

	function setSliders(rgb, opacity, index){
		currentlySelected = index;
		$scope.slider = {
			rgb: [rgb[0], rgb[1], rgb[2]], 
			opacity: opacity
		}
		$scope.palette = ObjectManipulatorFactory.setKeyToTrue($scope.palette, 'selected', currentlySelected);
	}

	function modifyColour(rgb){
		rgb = ObjectManipulatorFactory.arrayStringElementsToInteger(rgb);
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

	function duplicateColour(){
		var newColourScheme = angular.copy($scope.palette[currentlySelected]);
		$scope.palette.unshift(newColourScheme);
		currentlySelected = 0;
		$scope.palette = ObjectManipulatorFactory.setKeyToTrue($scope.palette, 'selected', currentlySelected);
	}

/************************************************************************
DATABASE FUNCTIONS
************************************************************************/

	function getPalette(num){
		ApiFactory.getPalette(num, function(response){
			$scope.jsonData = response;
			$scope.palette = PaletteFactory.createPalette(response);
			setSliders($scope.palette[0].rgb, $scope.palette[0].opacity, 0);
		});
	}

	function savePalette(){
		var exportable = JSON.stringify(PaletteFactory.createExportable($scope.palette));
		console.log(exportable)
	}

/************************************************************************
EVENT BINDERS
************************************************************************/

	$scope.setSliders = setSliders;
	$scope.modifyColour = modifyColour;
	$scope.modifyOpacity = modifyOpacity;
	$scope.duplicateColour = duplicateColour;
	$scope.getPalette = getPalette;
	$scope.savePalette = savePalette;

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
var ObjectManipulatorFactory = angular.module('ObjectManipulatorFactory', []);

ObjectManipulatorFactory.factory('ObjectManipulatorFactory', [function(){

	function setKeyToTrue(arrayOfObjects, propertyName, index){
		for(var i = 0; i < arrayOfObjects.length; i++){
			if(i == index) {
				arrayOfObjects[i][propertyName] = true;
			} else {
				arrayOfObjects[i][propertyName] = false;
			}
		}
		return arrayOfObjects;
	}

	function arrayStringElementsToInteger(array){
		for(var i = 0; i < array.length; i++){
			array[i] = parseInt(array[i]);
		}
		return array;
	}


	return {
		setKeyToTrue: setKeyToTrue,
		arrayStringElementsToInteger: arrayStringElementsToInteger
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
			paletteElement.selected = false;
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

	function createExportable(arrayOfPalette){
		var convertedPalette = [];

		for(var i = 0; i < arrayOfPalette.length; i++){
			var paletteElement = {};
			paletteElement.name = arrayOfPalette[i].name;
			paletteElement.baseColour = arrayOfPalette[i].rgb;
			paletteElement.tints = [];
			for(var j = 0; j < arrayOfPalette[i].tints.length; j++){
				var tint = [];
				for(var k = 0; k < 3; k++){
					tint.push(arrayOfPalette[i].tints[j].rgb[k] - arrayOfPalette[i].rgb[k])
				}
				paletteElement.tints.push(tint);
			}
			convertedPalette.push(paletteElement);
		}

		return convertedPalette;
	}

	return {
		createPalette: createPalette,
		rgbToHex: rgbToHex,
		tintCalculator: tintCalculator,
		createExportable: createExportable
	}

}])