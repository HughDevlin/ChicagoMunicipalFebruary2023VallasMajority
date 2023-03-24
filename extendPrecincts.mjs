/*
Trim properties of features 
HJD 2023-03-22
*/
import * as fs from 'node:fs';
import * as readline from 'node:readline';

// City of Chicago data portal
const inFile = './data/precincts.geojson';

// Chicago Board of Elections
// https://chicagoelections.gov/en/election-results.html
const inCsv = './data/dataexport.csv';

const outFile = './data/extendedPrecincts.geojson';

const inString = fs.readFileSync(inFile);
const featureCollection = JSON.parse(inString);
const features = featureCollection.features;

features.findFeature = function(ward, precinct) {
    return features.find(feature => feature.properties.ward == ward && feature.properties.precinct == precinct);
};

const csvInterface = readline.createInterface({
    input: fs.createReadStream(inCsv)
});

const wardPrecinctMatrix = []; // zero-based array of wards
const columnHeadings = []; // candidate names
var ward = 0;
csvInterface.on('line', (line) => {
    const tokens = line.split(',');
    if (tokens[0].startsWith('Ward')) {
        // start a new ward
        ward = parseInt(tokens[0].split(' ')[1]);
        wardPrecinctMatrix[ward - 1] = []; // zero-based array of precincts
    } else if (columnHeadings.length == 0 && tokens[0] == 'Votes') {
        // capture candidate names
        columnHeadings[0] = tokens[0]; // Votes
        tokens.forEach((value, index) => {
            if (index % 2 == 1 && value.length > 0) // odd?
                columnHeadings[Math.trunc(index / 2) + 1] = value;
        })
    } else if (ward > 0 && tokens[0].length > 0 && isFinite(tokens[0])) {
        // new precinct
        const precinct = parseInt(tokens[0]);
        const feature = features.findFeature(ward, precinct);
        const properties = feature.properties;
        const property = columnHeadings[0];
        properties.cboe = {}; // empty object for extended properties
        properties.cboe[property] = tokens[1]; // Votes
        // candidates
        columnHeadings.slice(1).forEach((value, index) => {
            const property = value.replace(/^"(.*)"$/, '$1').replace(/""/g, '"'); // clean Chuy
            properties.cboe[property] = tokens[2 * (index + 1)];
        });
    }; // end if
}).on('close', () => {
    const outString = JSON.stringify(featureCollection);
    fs.writeFileSync(outFile, outString);
    console.log('Done.');
}); // end on close
