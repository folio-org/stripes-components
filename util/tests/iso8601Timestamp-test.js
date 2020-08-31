import { describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import iso8601Timestamp from '../iso8601Timestamp';

describe('iso8601Timestamp', () => {
  const validT = '2020-03-24T17:59:57.369+00:00';

  describe('values like "2020-03-24T17:59:57.369+0000" are reformatted', () => {
    const invalidT = '2020-03-24T17:59:57.369+0000';
    it('an invalid timestamp is reformated', () => {
      expect(iso8601Timestamp(invalidT)).to.equal(validT);
    });
  });

  describe('other date values are left as-is', () => {
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

    // length == 28 but missing +
    it('input without a "+" is left as-is', () => {
      const value = '2020-03-24T17:59:57.369-0000';
      expect(iso8601Timestamp(value)).to.equal(value);
    });

    // length == 28 but + in wrong location
    it('input with misplaced "+" is left as-is', () => {
      const value = '2020-03-24T17:59:57+369-0000';
      expect(iso8601Timestamp(value)).to.equal(value);
    });
  });
});
