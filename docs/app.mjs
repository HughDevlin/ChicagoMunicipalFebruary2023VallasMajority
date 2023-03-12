/**
 * app.mjs
 * basic chloropleth
 * 2023-03-01 HJD
 */

export function app(id, wards, precincts, extendedProperties, palette) {

	const br = '<br>';
	const pct = '&percnt;';
	const gt = '&gt;';
	const copyright = '&copy;';
	
	const percent = (a, b) => b == 0 ? 0 : 100.0 * a / b;

	const bold = (s) => '<b>' + s + '</b>';

	extendedProperties.get = function(ward, precinct) {
		return this[ward - 1][precinct - 1];  // zero-based
	};

	const map = L.map(id);
	const center = [41.8781, -87.6298]; // Chicago lat long
	map.setView(center, 0);

	// Add basemap
	const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png ';
	const attribution =  ' <a href="https://chicagoelections.gov/">Chicagp Board of Election Commissioners</a> ' +
		' ' + copyright + ' ' +
		'<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
	const osm = L.tileLayer(osmUrl, {
		minZoom: 11,
		maxZoom: 16,
		attribution: attribution
	});
	map.addLayer(osm);

	// Add wards
	const wardsLayer = L.geoJSON(wards, {
		style: { className: 'wards' }
	});
	map.addLayer(wardsLayer);

	// Add precincts
	const precinctsLayer = L.geoJSON(precincts, {

		smoothFactor: 0.8,

		style: function (feature) {
			const returnValue = { className: 'precincts' };
			// color precincts
			const ward = Math.trunc(feature.properties.ward)
			const precinct = Math.trunc(feature.properties.precinct)
			const props = extendedProperties.get(ward, precinct);
			const percentage = percent(props['PAUL VALLAS'], props['Votes']);
			returnValue.fillColor = palette.get(percentage);
			return returnValue;
		},

		onEachFeature: function (feature, layer) {

			function propertiesList(props) {
				const keys = Object.keys(props); keys[0]
				var list = keys[0] + ': ' + props[keys[0]] + br; // Votes
				Object.keys(props).slice(1).forEach((key) => {
					const percentage = percent(props[key], props[keys[0]]);
					list += key + ': ' + props[key] + " (" + percentage.toFixed(1) + pct + ')' + br;
				});
				return list;
			};

			// Bind pop-up
			const ward = Math.trunc(feature.properties.ward)
			const precinct = Math.trunc(feature.properties.precinct)
			const props = extendedProperties.get(ward, precinct);
			const content = bold('Ward: ' + ward + br + 'Precinct: ' + precinct) + br + 
				propertiesList(props);
			layer.bindPopup(content, { minWidth: 330 });

			// Add hover behavior
			layer.on({
				mouseover: function (e) {
					this.openPopup();
				},
				mouseout: function (e) {
					this.closePopup();
				}
			});

		}

	});
	map.addLayer(precinctsLayer);
	map.fitBounds(precinctsLayer.getBounds());

	// Add legend    
	const legend = L.control({ position: 'topright' });
	legend.onAdd = function () {

		function colorSquare(color) {
			return '<i style="background: ' + color + '"></i>';
		};

		const div = L.DomUtil.create('div', 'info legend');
		div.innerHTML = pct + ' Vallas' + br // legend title
		// generate a labeled colored square for each interval
		for (var i = 1; i < palette.length - 1; i++) {
			div.innerHTML += colorSquare(palette[i]) + palette.breaks[i - 1] + '&ndash;' + palette.breaks[i] + pct + br;
		}; // end for
		div.innerHTML += colorSquare(palette[palette.length - 1]) + gt + palette.breaks[palette.length - 2] + pct;
		return div;
	}; // end onAdd handler

	legend.addTo(map);
	return map;
} // end function
