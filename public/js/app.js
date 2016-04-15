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

	$scope.defaultPalette = [];
	$scope.palette = [];

	$scope.slider = {
		name: '', 
		rgb: [0, 0, 0],
		opacity: 0
	}

	$scope.selectedPaletteElement = 0;

/************************************************************************
COLOUR PALETTE MODIFIER FUNCTIONS
************************************************************************/

	function setSliders(palette, index){
		$scope.selectedPaletteElement = index;
		$scope.slider = {
			name: palette[index]['name'], 
			rgb: [palette[index]['rgb'][0], palette[index]['rgb'][1], palette[index]['rgb'][2]], 
			opacity: palette[index]['opacity']
		}
		$scope.palette = ObjectManipulatorFactory.setKeyToTrue($scope.palette, 'selected', $scope.selectedPaletteElement);
	}

	function modifyColour(slider){
		var rgb = slider.rgb;
		$scope.palette[$scope.selectedPaletteElement].name = slider.name;
		$scope.palette = PaletteFactory.editPalette($scope.palette, $scope.defaultPalette, rgb, $scope.selectedPaletteElement);
	}

	function modifyOpacity(opacity){
		$scope.palette[$scope.selectedPaletteElement].opacity = opacity;
	}

	function duplicateColour(){
		var newColourScheme = angular.copy($scope.palette[$scope.selectedPaletteElement]);
		newColourScheme.name = 'New' + newColourScheme.name;
		$scope.palette.unshift(newColourScheme);
		$scope.palette = ObjectManipulatorFactory.setKeyToTrue($scope.palette, 'selected', $scope.selectedPaletteElement);
		setSliders($scope.palette, 0);
		document.body.scrollTop = 0;
	}

	function deleteColour(){
		if($scope.palette.length > 1){
			$scope.palette.splice($scope.selectedPaletteElement, 1);
			$scope.selectedPaletteElement = 0;
			setSliders($scope.palette, 0);
		}
	}

/************************************************************************
DATABASE FUNCTIONS
************************************************************************/

	function getPalette(num){
		ApiFactory.getPalette(num, function(response){
			$scope.defaultPalette = response;
			$scope.palette = PaletteFactory.createPalette(response);
			setSliders($scope.palette, 0);
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
	$scope.deleteColour = deleteColour;

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

PaletteFactory.factory('PaletteFactory', ['ObjectManipulatorFactory', function(ObjectManipulatorFactory){

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

	function editPalette(palette, defaultPalette, rgb, index){
		rgb = ObjectManipulatorFactory.arrayStringElementsToInteger(rgb);
		palette[index].hex = rgbToHex(rgb);
		palette[index].rgb = rgb;
		var tintModifiers = defaultPalette[index].tints;
		for(var i = 0; i < tintModifiers.length; i++){
			var modifiedTint = tintCalculator(palette[index].rgb, tintModifiers[i]);
			palette[index].tints[i].hex = rgbToHex(modifiedTint);
			palette[index].tints[i].rgb = modifiedTint;
		}
		return palette;
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
		createExportable: createExportable,
		editPalette: editPalette
	}

}])