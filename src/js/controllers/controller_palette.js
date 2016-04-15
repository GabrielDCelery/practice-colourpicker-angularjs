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

	function modifyColour(slider){
		var rgb = slider.rgb;
		$scope.palette[$scope.selectedColourIndex].name = slider.name;
		$scope.palette = PaletteFactory.editPalette($scope.palette, $scope.defaultPalette, rgb, $scope.selectedColourIndex);
	}

	function modifyOpacity(opacity){
		$scope.palette[$scope.selectedColourIndex].opacity = opacity;
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
			$scope.defaultPalette = response;
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