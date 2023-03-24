# Chicago Election Results by Precinct
Simple elections results [chloropleth](https://en.wikipedia.org/wiki/Choropleth_map) for the web, using javascript, [OpenStreetMap](https://www.openstreetmap.org/), and [LeafLet](https://leafletjs.com/).

[View on GitHub Pages](https://hughdevlin.github.io/ChicagoMunicipalFebruary2023VallasMajority/).

Clone me.

1. Download Election Results in spreadsheet format as dataexport.xls from the [Chicago Board of Election Commissioners](https://chicagoelections.gov/en/election-results.html) (current as of offical results).
2. Download precinct and (optionally) ward boundaries as [GeoJSON](https://geojson.org/) from the [City of Chicago Data Portal](https://data.cityofchicago.org/browse?q=gis%20boundaries&sortBy=relevance)
3. Run scripts to trim the Chicago geojson.
    1. precincts.mjs
    2. wards.mjs
4. Use [LibreOffice Calc](https://www.libreoffice.org/discover/calc/) or equivalent to export the results as a [comma separated values](https://en.wikipedia.org/wiki/Comma-separated_values) (*.csv).
5. Run script extendPrecincts.mjs to merge the CSV data into the precinct GeoJSON properties.
6. Customize 
    1. the color palette in docs/palette.mjs and the tests in test/TestPalette.mjs
    3. the precinct coloring and the legend in docs/app.mjs

Resources

- More on [GitHub Pages](https://pages.github.com/)
- [Markdown Cheat Sheet](https://www.markdownguide.org/cheat-sheet/)
- [Mocha JavaScript test framework](https://mochajs.org/)