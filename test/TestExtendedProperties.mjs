import assert from 'node:assert';
import extendedProperties from  '../docs/dataexport.json' assert {type: 'json'} ;
import {extendedPropertiesAccessor} from '../docs/app.mjs';

extendedProperties.get = extendedPropertiesAccessor;

describe('extendedProperties', function () {
    describe('get', function () {
        it('should throw TypeError when the 1st arg is negative', function () {
            assert.throws(() => extendedProperties.get(-1, 1), TypeError);
        });
        it('should be undefined when the 2nd arg is negative', function () {
            assert.equal(typeof(extendedProperties.get(1, -1)), 'undefined');
        });
        it('should throw TypeError when the ward is greater than 50', function () {
            assert.throws(() => extendedProperties.get(51, 1), TypeError);
        });
        it('should be undefined when the precinct is too large', function () {
            assert.equal(typeof(extendedProperties.get(50, 30)), 'undefined');
        });
        it('should return 652 votes from ward 50 precinct 7', function () {
            assert.equal(extendedProperties.get(50, 7).Votes, 652);
        });
    });
});