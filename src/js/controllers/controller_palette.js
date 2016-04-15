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

	$scope.selectedPaletteElement = 0;

/************************************************************************
COLOUR PALETTE MODIFIER FUNCTIONS
************************************************************************/

	function setSliders(rgb, opacity, index){
		$scope.selectedPaletteElement = index;
		$scope.slider = {
			rgb: [rgb[0], rgb[1], rgb[2]], 
			opacity: opacity
		}
		$scope.palette = ObjectManipulatorFactory.setKeyToTrue($scope.palette, 'selected', $scope.selectedPaletteElement);
	}

	function modifyColour(rgb){
		$scope.palette = PaletteFactory.editPalette($scope.palette, $scope.defaultPalette, rgb, $scope.selectedPaletteElement);
	}

	function modifyOpacity(opacity){
		$scope.palette[$scope.selectedPaletteElement].opacity = opacity;
	}

	function duplicateColour(){
		var newColourScheme = angular.copy($scope.palette[$scope.selectedPaletteElement]);
		$scope.palette.unshift(newColourScheme);
		$scope.palette = ObjectManipulatorFactory.setKeyToTrue($scope.palette, 'selected', $scope.selectedPaletteElement);
		setSliders($scope.palette[0].rgb, $scope.palette[0].opacity, 0);
		document.body.scrollTop = 0;
	}

	function deleteColour(){
		if($scope.palette.length > 1){
			$scope.palette.splice($scope.selectedPaletteElement, 1);
			$scope.selectedPaletteElement = 0;
			$scope.palette = ObjectManipulatorFactory.setKeyToTrue($scope.palette, 'selected', 0);
		}
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
	$scope.deleteColour = deleteColour;

/************************************************************************
INITIATING FUNCTION UPON LOADING
************************************************************************/

	getPalette(1);

}])