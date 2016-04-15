var ObjectManipulatorFactory = angular.module('ObjectManipulatorFactory', []);

ObjectManipulatorFactory.factory('ObjectManipulatorFactory', [function(){

	function setSelectedKeyToTrueOthersToFalse(arrayOfObjects, propertyName, index){
		for(var i = 0; i < arrayOfObjects.length; i++){
			if(i == index) {
				arrayOfObjects[i][propertyName] = true;
			} else {
				arrayOfObjects[i][propertyName] = false;
			}
		}
		return arrayOfObjects;
	}

	function arrayStringElementsToIntegers(array){
		for(var i = 0; i < array.length; i++){
			array[i] = parseInt(array[i]);
		}
		return array;
	}


	return {
		setSelectedKeyToTrueOthersToFalse: setSelectedKeyToTrueOthersToFalse,
		arrayStringElementsToIntegers: arrayStringElementsToIntegers
	}

}])