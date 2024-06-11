import {
  describe,
  it,
} from 'mocha';
import { expect } from 'chai';

import getHookExecutionResult from '../../tests/helpers/getHookExecutionResult';
import useProvidedIdOrCreate from '../useProvidedIdOrCreate';

describe('useProvidedIdOrCreate', () => {
  it('should return the provided id', async () => {
    const res = await getHookExecutionResult(useProvidedIdOrCreate, 'testId');
    expect(res).to.equal('testId');
  });

  it('with no id parameter provided, it should return a generated id', async () => {
    const res = await getHookExecutionResult(useProvidedIdOrCreate);
    expect(res).to.not.equal('testId');
  });

  it('supplies generated id with prefix', async () => {
    const res = await getHookExecutionResult(useProvidedIdOrCreate, [undefined, 'testPrefix-']);
    expect(res).to.match(new RegExp('^testPrefix-'));
  });
});
