import {
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import getHookExecutionResult from '../../tests/helpers/getHookExecutionResult';
import useFormatTime from '../useFormatTime';

describe('useFormatTime', () => {
  const hookResult = getHookExecutionResult(useFormatTime);

  it('should return correct time', () => {
    expect(hookResult('2020-03-24T17:59:57.369+0000')).to.equal('5:59 PM');
  });
});
