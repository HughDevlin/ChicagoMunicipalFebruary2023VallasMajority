import {palette} from '../docs/palette.mjs'
import assert from 'node:assert'

describe('palette', function () {
  describe('get', function () {
    it('should return "transparent" when the value is negative', function () {
      assert.equal(palette.get(-1), 'transparent');
    });
    it('should return "transparent" when the value is 0', function () {
      assert.equal(palette.get(0), 'transparent');
    });
    it('should return "transparent" when the value is 49', function () {
      assert.equal(palette.get(49), 'transparent');
    });
    it('should return "gold" when the value is 50', function () {
      assert.equal(palette.get(50), 'gold');
    });
    it('should return "gold" when the value is 59', function () {
      assert.equal(palette.get(59), 'gold');
    });
    it('should return "orange" when the value is 60', function () {
      assert.equal(palette.get(60), 'orange');
    });
    it('should return "orange" when the value is 69', function () {
      assert.equal(palette.get(69), 'orange');
    });
    it('should return "red" when the value is 70', function () {
      assert.equal(palette.get(70), 'red');
    });
    it('should return "red" when the value is 75', function () {
      assert.equal(palette.get(75), 'red');
    });
    it('should return "darkred" when the value is 80', function () {
      assert.equal(palette.get(80), 'darkred');
    });
    it('should return "darkred" when the value is 85', function () {
      assert.equal(palette.get(85), 'darkred');
    });
  });
});