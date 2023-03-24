// geojson from the City of Chicago data portal
import precincts from './extendedPrecincts.geojson' assert {type: 'json'};
import wards from './wards.geojson' assert {type: 'json'};
import {palette} from './palette.mjs';
import {app} from './app.mjs';
app("map", wards, precincts, palette);