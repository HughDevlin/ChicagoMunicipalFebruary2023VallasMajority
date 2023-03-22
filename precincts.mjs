/*
Trim properties of features 
HJD 2023-03-22
*/
import * as fs from 'node:fs';
// City of Chicago data portal
const inFile = './data/Boundaries - Ward Precincts (2023-).geojson';
const outFile = './data/precincts.geojson';
const inString = fs.readFileSync(inFile);
const featureCollection = JSON.parse(inString);
const features = featureCollection.features;
features.forEach((feature) => {
    // convert ward and precinct from string to int
    feature.properties.ward = Math.trunc(feature.properties.ward);
    feature.properties.precinct = Math.trunc(feature.properties.precinct);
    // unused properties
    delete feature.properties.ward_precinct;
    delete feature.properties.shape_leng;
    delete feature.properties.shape_area;
});
const outString = JSON.stringify(featureCollection);
fs.writeFileSync(outFile, outString);
console.log('Done.');