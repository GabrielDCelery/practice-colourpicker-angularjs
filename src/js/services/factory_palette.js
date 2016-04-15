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
				tint.tint = arrayOfPalette[i].tints[j];
				paletteElement.tints.push(tint);
			}
			convertedPalette.push(paletteElement);
		}

		return convertedPalette;
	}

	function editPalette(palette, rgb, index){
		palette[index].rgb = rgb;
		palette[index].hex = rgbToHex(rgb);
		var tints = palette[index].tints;
		for(var i = 0; i < palette[index].tints.length; i++){
			var modifiedTint = tintCalculator(palette[index].rgb, palette[index].tints[i].tint);
			palette[index].tints[i].rgb = modifiedTint;
			palette[index].tints[i].hex = rgbToHex(modifiedTint);
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
			for(var j = 0; j < arrayOfPalette[i].tints.length;j++){
				paletteElement.tints.push(arrayOfPalette[i].tints[j].tint);
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