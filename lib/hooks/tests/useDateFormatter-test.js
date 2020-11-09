import {
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import getHookExecutionResult from '../../../tests/helpers/getHookExecutionResult';
import useDateFormatter from '../useDateFormatter';

describe('useDateFormatter', () => {
  const hookResult = getHookExecutionResult(useDateFormatter);

  it('should return correct date', () => {
    expect(hookResult('2020-03-24T17:59:57.369+0000')).to.equal('3/24/2020');
  });
});
