/**
 * palette.js
 * Chloropleth color palette
 * see https://colorbrewer2.org/
 * 2023-03-01 HJD
 */
	
export const palette = [
	'transparent',
	'gold',
	'orange',
	'red',
	'darkred'
];

palette.DEFAULT = palette[0];

palette.breaks = [
	50,
	60,
	70,
	80,
	100
];

palette.get = function(x) {
	const index = palette.breaks.findIndex(function(element) {
		return element > x;
	});
	return index == -1 ? palette.DEFAULT : palette[index];		
};
