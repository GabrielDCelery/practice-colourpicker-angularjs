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

	$scope.palette = [];

	$scope.slider = {
		name: '', 
		rgb: [0, 0, 0],
		opacity: 0
	}

	$scope.selectedColourIndex = 0;

/************************************************************************
COLOUR PALETTE MODIFIER FUNCTIONS
************************************************************************/

	function selectColour(palette, index){
		$scope.selectedColourIndex = index;
		$scope.slider = {
			name: palette[index]['name'], 
			rgb: [palette[index]['rgb'][0], palette[index]['rgb'][1], palette[index]['rgb'][2]], 
			opacity: palette[index]['opacity']
		}
		$scope.palette = ObjectManipulatorFactory.setKeyToTrue($scope.palette, 'selected', $scope.selectedColourIndex);
	}

	function editColour(slider){
		slider.rgb = ObjectManipulatorFactory.arrayStringElementsToInteger(slider.rgb);
		$scope.palette = PaletteFactory.editPalette($scope.palette, $scope.selectedColourIndex, slider);
	}

	function duplicateColour(){
		var newColourScheme = angular.copy($scope.palette[$scope.selectedColourIndex]);
		newColourScheme.name = 'New' + newColourScheme.name;
		$scope.palette.unshift(newColourScheme);
		selectColour($scope.palette, 0);
		document.body.scrollTop = 0;
	}

	function deleteColour(){
		if($scope.palette.length > 1){
			$scope.palette.splice($scope.selectedColourIndex, 1);
			selectColour($scope.palette, 0);
		}
	}

/************************************************************************
DATABASE FUNCTIONS
************************************************************************/

	function getPalette(num){
		ApiFactory.getPalette(num, function(response){
			$scope.palette = PaletteFactory.createPalette(response);
			selectColour($scope.palette, 0);
		});
	}

	function savePalette(){
		var exportable = JSON.stringify(PaletteFactory.createExportable($scope.palette));
		console.log(exportable)
	}

/************************************************************************
EVENT BINDERS
************************************************************************/

	$scope.selectColour = selectColour;
	$scope.editColour = editColour;
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

PaletteFactory.factory('PaletteFactory', [function(){

	function rgbNumberToHex(rgbNumber) {
		var hex = rgbNumber.toString(16);
		return hex.length == 1 ? '0' + hex : hex;
	}

	function rgbToHex(array){
		return '#' + rgbNumberToHex(array[0]) + rgbNumberToHex(array[1]) + rgbNumberToHex(array[2]);
	}

	function tintCalculator(rgbColour, tint){
		var modifiedRbgColour = [];
		for(var i = 0; i < 3; i++){
			var modifiedRbgValue = rgbColour[i] + tint[i];
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

	function createPalette(palette){
		var convertedPalette = [];

		for(var i = 0; i < palette.length; i++){
			var paletteElement = {};
			paletteElement.name = palette[i].name;
			paletteElement.rgb = palette[i].baseColour;
			paletteElement.hex = rgbToHex(palette[i].baseColour);
			paletteElement.opacity = 1;
			paletteElement.tints = [];
			paletteElement.selected = false;
			for(var j = 0; j < palette[i].tints.length; j++){
				var tint = {};
				tint.rgb = tintCalculator(palette[i].baseColour, palette[i].tints[j]);
				tint.hex = rgbToHex(tint.rgb);
				tint.tint = palette[i].tints[j];
				paletteElement.tints.push(tint);
			}
			convertedPalette.push(paletteElement);
		}

		return convertedPalette;
	}

	function editPalette(palette, index, slider){
		palette[index].name = slider.name;
		palette[index].rgb = slider.rgb;
		palette[index].hex = rgbToHex(slider.rgb);
		palette[index].opacity = slider.opacity;
		var tints = palette[index].tints;
		for(var i = 0; i < palette[index].tints.length; i++){
			var modifiedTint = tintCalculator(palette[index].rgb, palette[index].tints[i].tint);
			palette[index].tints[i].rgb = modifiedTint;
			palette[index].tints[i].hex = rgbToHex(modifiedTint);
		}

		return palette;
	}

	function createExportable(palette){
		var convertedPalette = [];

		for(var i = 0; i < palette.length; i++){
			var paletteElement = {};
			paletteElement.name = palette[i].name;
			paletteElement.baseColour = palette[i].rgb;
			paletteElement.tints = [];
			for(var j = 0; j < palette[i].tints.length;j++){
				paletteElement.tints.push(palette[i].tints[j].tint);
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