import { describe, it } from 'mocha';
import { expect } from 'chai';

import iso8601Timestamp from '../iso8601Timestamp';

describe('iso8601Timestamp', () => {
  const validT = '2020-03-24T17:59:57.369+00:00';
  const validTMinus = '2020-03-24T17:59:57.369-00:00';

  describe('values like "2020-03-24T17:59:57.369+0000" are reformatted', () => {
    const invalidPlus = '2020-03-24T17:59:57.369+0000';
    it('a valid UTC+ timestamp with a missing colon is reformatted', () => {
      expect(iso8601Timestamp(invalidPlus)).to.equal(validT);
    });

    const invalidMinus = '2020-03-24T17:59:57.369-0000';
    it('a valid UTC- timestamp with a missing colon is reformatted', () => {
      expect(iso8601Timestamp(invalidMinus)).to.equal(validTMinus);
    });
  });

  describe('other date values are left as-is', () => {
    describe('strings', () => {
      it('a valid timestamp is left as-is', () => {
        expect(iso8601Timestamp(validT)).to.equal(validT);
      });

      // length < 28
      it('too-short input is left as-is', () => {
        const value = 'abc';
        expect(iso8601Timestamp(value)).to.equal(value);
      });

      // length > 28
      it('too-long input is left as-is', () => {
        const value = '2020-03-24T17:59:57.369+0000abc';
        expect(iso8601Timestamp(value)).to.equal(value);
      });

      // length == 28 but missing +/-
      it('input without "+" or "-" in the correct position is left as-is', () => {
        const value = '2020-03-24T17:59:57.369=0000';
        expect(iso8601Timestamp(value)).to.equal(value);
      });
    });

    describe('objects', () => {
      const o = new Date();

      it('object input is left as-is', () => {
        expect(iso8601Timestamp(o)).to.equal(o);
      });
    });

    describe('numbers', () => {
      const millis = Date.now();
      it('numeric input is left as-is', () => {
        expect(iso8601Timestamp(millis)).to.equal(millis);
      });
    });
  });
});
