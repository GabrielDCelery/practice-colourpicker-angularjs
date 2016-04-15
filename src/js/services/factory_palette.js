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