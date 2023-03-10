// City of Chicago data portal
import precincts from './Boundaries - Ward Precincts (2023-).geojson' assert {type: 'json'};
import wards from './Boundaries - Wards (2023-).geojson' assert {type: 'json'};
// pre-processed export from Chicago Board of Electons
// indexed by ward and precinct (zero-based)
import extendedProperties from  './dataexport.json' assert {type: 'json'};
import {palette} from './palette.mjs';
import {app} from './app.mjs';
app("map", wards, precincts, extendedProperties, palette);