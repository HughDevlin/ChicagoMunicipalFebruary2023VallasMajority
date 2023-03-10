/*
Convert Chicago Board of Elections results CSV download
to a compact json representation suitable for the web
HJD 2022-01-07 
*/
import * as fs from 'node:fs';
import * as readline from 'node:readline';

// Chicago Board of Elections
// https://chicagoelections.gov/en/election-results.html
const csvInterface = readline.createInterface({
    input: fs.createReadStream('data/dataexport.csv')
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
        columnHeadings[0] = tokens[0];
        tokens.forEach((value, index) => {
            if (index % 2 == 1 && value.length > 0) // odd?
                columnHeadings[Math.trunc(index / 2) + 1] = value;
        })
    } else if (ward > 0 && isFinite(tokens[0])) {
        // new precinct
        const precinct = parseInt(tokens[0]);
        wardPrecinctMatrix[ward - 1][precinct - 1] = {}; // empty object for properties and values
        wardPrecinctMatrix[ward - 1][precinct - 1][columnHeadings[0]] = tokens[1]; // Votes
        columnHeadings.slice(1).forEach((value, index) => {
            const property = value.replace(/^"(.*)"$/, '$1').replace(/""/g, '"'); // clean Chuy
            wardPrecinctMatrix[ward - 1][precinct - 1][property] = tokens[2 * (index + 1)];
        });
    }
}).on('close', () => {
    const dataString = JSON.stringify(wardPrecinctMatrix)
    fs.writeFile('data/dataexport.json', dataString, (err) => {
        if (err) {
            throw err;
        };
        console.log('Done.');
    })
});