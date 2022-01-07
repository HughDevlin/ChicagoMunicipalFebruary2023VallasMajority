/*
Convert Chicago Board of Elections results CSV download
to a compact json representation suitable for the web 
HJD 2022-01-07 
*/
const fs = require('fs');
const readline = require('readline');

const interface = readline.createInterface({
    input: fs.createReadStream('dataexport.csv')
});

var ward = 0;
const wards = [];
interface.on('line', (line) => {
    // console.log(line);
    tokens = line.split(',');
    token0 = tokens[0];
    if(token0.startsWith('Ward')) {
        ward = parseInt(token0.split(' ')[1]);
        wards[ward] = [];
    } else if(ward > 0 && isFinite(token0)) {
        const precinct = parseInt(token0);
        const votes = parseInt(tokens[1]);
        const democratic = parseInt(tokens[2]);
        const republican = parseInt(tokens[4]);
        wards[ward][precinct] = {v: votes, d: democratic, r: republican};
    }
}).on('close', () => {
    fs.writeFile('dataexport.json', JSON.stringify(wards), (err) => {
        if (err) {
            throw err;
        }  
    })  
});
