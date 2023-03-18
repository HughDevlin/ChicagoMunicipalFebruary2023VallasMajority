/**
 * app.mjs
 * basic chloropleth
 * 2023-03-01 HJD
 */

export function app(id, wards, precincts, extendedProperties, palette) {

	const br = '<br />';
	const pct = '&percnt;';
	const gt = '&gt;';
	const copyright = '&copy;';
	
	const percent = (a, b) => b == 0 ? 0 : 100.0 * a / b;

	const heading = (s) => '<h4>' + s + '</h4>';

	extendedProperties.get = function(ward, precinct) {
		return this[ward - 1][precinct - 1];  // zero-based
	};

	const map = L.map(id);

	// tooltips array
	map.tooltips = function() {
		const tooltips = [];
		this.eachLayer(function(layer) {
			if (layer.getTooltip) {
				const toolTip = layer.getTooltip();
				if (toolTip) {
					tooltips.push(toolTip);
				}
			}
		}); // end each layer handler
		return tooltips;
	}; // end function tooltips

	// Add basemap
	const center = [41.8781, -87.6298]; // Chicago lat long
	map.setView(center, 0);
	const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png ';
	const attribution =  ' <a href="https://chicagoelections.gov/">Chicagp Board of Election Commissioners</a> ' +
		' ' + copyright + ' ' +
		'<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
	const osm = L.tileLayer(osmUrl, {
		minZoom: 11, // widest
		maxZoom: 16, // narrowest
		attribution: attribution
	});
	map.addLayer(osm);

	// Add wards
	const wardsLayer = L.geoJSON(wards, {style: {className: 'wards'}});
	map.addLayer(wardsLayer);

	// Add precincts
	const precinctsLayer = L.geoJSON(precincts, {

		smoothFactor: 0.8,

		style: function (feature) {
			// css overrides leaflet
			const style = {className: 'precincts', fillOpacity: 0.5};
			// color precincts
			const ward = Math.trunc(feature.properties.ward);
			const precinct = Math.trunc(feature.properties.precinct);
			const props = extendedProperties.get(ward, precinct);
			const percentage = percent(props['PAUL VALLAS'], props['Votes']);
			style.fillColor = palette.get(percentage);
			return style;
		},

		onEachFeature: function (feature, layer) {

			const ward = Math.trunc(feature.properties.ward);
			const precinct = Math.trunc(feature.properties.precinct);
			const props = extendedProperties.get(ward, precinct);

			function propertiesList(props) {
				const keys = Object.keys(props);
				var list = keys[0] + ': ' + props[keys[0]] + br; // Votes
				Object.keys(props).slice(1).forEach((key) => {
					const percentage = percent(props[key], props[keys[0]]);
					list += key + ': ' + props[key] + " (" + percentage.toFixed(1) + pct + ')' + br;
				}); // end for each property
				return list;
			};

			// Bind pop-up
			const content = heading('Ward: ' + ward + ', Precinct: ' + precinct) + 
				propertiesList(props);
			layer.bindPopup(content, {minWidth: 330});

			// Add hover behavior: "dim" slightly
			layer.on({
				mouseover: function () {
					this.setStyle({fillOpacity: 0.3});
				},
				mouseout: function () {
					precinctsLayer.resetStyle();
				}
			});

			// Add tooltips to label precincts
			const precinctLabel = 'Ward ' + ward + br + 'Precinct ' + precinct;
			layer.bindTooltip(precinctLabel, {
				permanent: true,
				direction: 'center',
				className: 'precinct-label'
			});   
		} // end onEachFeature handler

	});
	map.addLayer(precinctsLayer);
	map.tooltips().forEach((tooltip) =>	map.closeTooltip(tooltip));
	map.fitBounds(precinctsLayer.getBounds());

	// Add legend    
	const legend = L.control({position: 'topright'});
	legend.onAdd = function () {

		function colorSquare(color) {
			return '<i style="background: ' + color + '"></i>';
		};

		const div = L.DomUtil.create('div', 'info legend');
		div.innerHTML = heading(pct + ' Vallas') // legend title
		// generate a labeled colored square for each interval
		for (var i = 1; i < palette.length - 1; i++) {
			div.innerHTML += colorSquare(palette[i]) + palette.breaks[i - 1] + '&ndash;' + palette.breaks[i] + pct + br;
		}; // end for
		div.innerHTML += colorSquare(palette[palette.length - 1]) + gt + palette.breaks[palette.length - 2] + pct;
		return div;
	}; // end legend onAdd handler
	legend.addTo(map);

	var previousZoomLevel = map.getZoom();
	map.on('zoomend', function(e){
		// higher is in, lower is out
		const ZOOM_THRESHOLD = 15;
		const zoomLevel = map.getZoom();
		if((zoomLevel < ZOOM_THRESHOLD) && (previousZoomLevel >= ZOOM_THRESHOLD)) {
			// zoom out
			this.tooltips().forEach((tooltip) => this.closeTooltip(tooltip));
		} 
		else if((zoomLevel >= ZOOM_THRESHOLD) && (previousZoomLevel < ZOOM_THRESHOLD)) {
			// zoom in
			this.tooltips().forEach((tooltip) => this.openTooltip(tooltip));
		}; // end if
		previousZoomLevel = zoomLevel;
	}); // end map on zoomend handler

	return map;
} // end function app
