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
		$scope.palette = PaletteFactory.editPalette($scope.palette, $scope.defaultPalette, rgb, currentlySelected);
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
			$scope.defaultPalette = response;
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