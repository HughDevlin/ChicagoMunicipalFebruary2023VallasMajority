/*
Trim properties of features 
HJD 2023-03-22
*/
import * as fs from 'node:fs';
// City of Chicago data portal
const inFile = './data/Boundaries - Wards (2023-).geojson';
const outFile = './data/wards.geojson';
const inString = fs.readFileSync(inFile);
const featureCollection = JSON.parse(inString);
const features = featureCollection.features;
features.forEach((feature) => {
    // convert ward and precinct from string to int
    feature.properties.ward = Math.trunc(feature.properties.ward);
    // unused properties
    delete feature.properties.ward_id;
    delete feature.properties.st_area_sh;
    delete feature.properties.st_length_;
    delete feature.properties.edit_date;
    delete feature.properties.objectid;
    delete feature.properties.globalid;
});
const outString = JSON.stringify(featureCollection);
fs.writeFileSync(outFile, outString);
console.log('Done.');